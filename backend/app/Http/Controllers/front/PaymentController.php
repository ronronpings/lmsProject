<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use App\Mail\PaymentSuccessMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;


class PaymentController extends Controller
{
    
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $course = Course::findOrFail($request->course_id);
        $user = $request->user(); // authenticated user via Sanctum

        // Check kung enrolled na
        $alreadyEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json([
                'status' => false,
                'message' => 'You are already enrolled in this course.',
            ], 409);
        }

        // Set Stripe Secret Key
        Stripe::setApiKey(env('STRIPE_SECRET'));

        // Create Stripe Checkout Session
        // Stripe will handle the entire payment.
        $checkoutSession = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => $course->title,
                        'description' => 'Course enrollment for: ' . $course->title,
                    ],
                    // Stripe expects amount in CENTS ()
                    'unit_amount' => intval($course->price * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => 'http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost:5173/detail/' . $course->id . '?cancelled=true',
            'metadata' => [
                'user_id' => $user->id,
                'course_id' => $course->id,
            ],
        ]);

        // Save pending payment record
        Payment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'stripe_checkout_session_id' => $checkoutSession->id,
            'amount' => $course->price,
            'currency' => 'usd',
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Checkout session created.',
            'checkout_url' => $checkoutSession->url,
            'session_id' => $checkoutSession->id,
        ]);
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'session_id' => 'required|string',
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // Retrieve the session from Stripe 
            $session = StripeSession::retrieve($request->session_id);

            // Find the payment record
            $payment = Payment::where('stripe_checkout_session_id', $session->id)->first();

            if (!$payment) {
                return response()->json([
                    'status' => false,
                    'message' => 'Payment record not found.',
                ], 404);
            }

            // Check if payment was successful
            if ($session->payment_status === 'paid') {
                // Update payment record
                $payment->update([
                    'stripe_payment_intent_id' => $session->payment_intent,
                    'status' => 'paid',
                ]);

                // Enroll the user in the course!
                Enrollment::firstOrCreate([
                    'user_id' => $payment->user_id,
                    'course_id' => $payment->course_id,
                ]);

                // Get course title
                $course = Course::find($payment->course_id);
                $user = User::find($payment->user_id);

                $emailData = [
                    'payment_id' => $payment->id,
                    'user_name' => $user->name,
                    'course_title' => $course->title,
                    'amount' => $payment->amount,
                    'currency' => strtoupper($payment->currency),
                    'transaction_id' => $payment->stripe_payment_intent_id,
                    'status' => 'paid',
                    'paid_at' => $payment->updated_at->format('M d, Y h:i A'),
                ];

                Mail::to($user->email)->send(new PaymentSuccessMail($emailData));
                

                return response()->json([
                    'status' => true,
                    'message' => 'Payment successful! You are now enrolled.',
                    'data' => [
                        'payment_id' => $payment->id,
                        'course_id' => $payment->course_id,
                        'course_title' => $course->title ?? 'Course',
                        'amount' => $payment->amount,
                        'currency' => strtoupper($payment->currency),
                        'transaction_id' => $payment->stripe_payment_intent_id,
                        'status' => 'paid',
                        'paid_at' => $payment->updated_at->format('M d, Y h:i A'),
                    ],
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Payment was not completed.',
                'payment_status' => $session->payment_status,
            ], 402);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error verifying payment: ' . $e->getMessage(),
            ], 500);
        }
    }
}
