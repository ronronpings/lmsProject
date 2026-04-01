import React, { useEffect, useState } from 'react';
import { Layout } from '../common/Layout';
import { apiUrl, getToken } from '../common/Config';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('Verifying your payment...');
  const [paymentData, setPaymentData] = useState(null);

  const sessionId = searchParams.get('session_id');

  const verifyPayment = async () => {
    const token = getToken();

    if (!sessionId) {
      setStatus('error');
      setMessage('No session ID found. Invalid payment link.');
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('Please login to verify your payment.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setStatus('success');
        setMessage(data.message || 'Payment successful! You are now enrolled.');
        setPaymentData(data.data);
        toast.success('Payment successful!');
      } else {
        setStatus('error');
        setMessage(data.message || 'Payment verification failed.');
        toast.error(data.message || 'Payment verification failed.');
      }
    } catch (error) {
      console.error('Verify error:', error);
      setStatus('error');
      setMessage('An error occurred while verifying payment.');
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <Layout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            {/* VERIFYING STATE */}
            {status === 'verifying' && (
              <div className="bg-white rounded-4 shadow p-5 text-center">
                <div
                  className="spinner-border text-primary mb-3"
                  style={{ width: '3rem', height: '3rem' }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h3 className="h4 mt-3">{message}</h3>
                <p className="text-muted">
                  Please wait while we confirm your payment...
                </p>
              </div>
            )}

            {/* SUCCESS STATE */}
            {status === 'success' && paymentData && (
              <div className="bg-white rounded-4 shadow overflow-hidden">
                {/* Green header */}
                <div
                  className="text-center py-4"
                  style={{
                    background:
                      'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white mb-3"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#28a745"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h2
                    className="text-white mb-1"
                    style={{ fontWeight: 700, fontSize: '1.75rem' }}
                  >
                    Payment Successful!
                  </h2>
                  <p className="text-white-50 mb-0">
                    Thank you for your purchase. Check your email for the
                    payment receipt and course details.
                  </p>
                </div>

                {/* Payment summary */}
                <div className="p-4">
                  <div className="text-center mb-4">
                    <h4 className="fw-bold mb-1">
                      Thank you! Your payment of ${paymentData.amount} has been
                      received.
                    </h4>
                    <p className="text-muted mb-0">
                      Order ID: #{paymentData.payment_id} | Transaction ID:{' '}
                      {paymentData.transaction_id}
                    </p>
                  </div>

                  {/* Payment Details Box */}
                  <div className="border rounded-3 p-4 mb-4">
                    <h5 className="text-center text-muted mb-3">
                      Payment Details
                    </h5>
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="text-muted small">Course</div>
                        <div className="fw-semibold">
                          {paymentData.course_title}
                        </div>
                      </div>
                      <div className="col-6 text-end">
                        <div className="text-muted small">Amount Paid</div>
                        <div className="fw-semibold">
                          ${paymentData.amount} {paymentData.currency}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted small">Status</div>
                        <span className="badge bg-success">
                          {paymentData.status}
                        </span>
                      </div>
                      <div className="col-6 text-end">
                        <div className="text-muted small">Date</div>
                        <div className="fw-semibold">{paymentData.paid_at}</div>
                      </div>
                    </div>
                  </div>

                  {/* Info text */}
                  <p className="text-center text-muted small mb-4">
                    You now have full access to this course. Start learning
                    right away!
                  </p>

                  {/* Action Button */}
                  <div className="text-center">
                    <button
                      className="btn btn-primary btn-lg px-5"
                      onClick={() => navigate('/account/courses-enrolled')}
                      style={{ borderRadius: '50px' }}
                    >
                      Go to My Learning
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ERROR STATE */}
            {status === 'error' && (
              <div className="bg-white rounded-4 shadow overflow-hidden">
                {/* Red header */}
                <div
                  className="text-center py-4"
                  style={{
                    background:
                      'linear-gradient(135deg, #dc3545 0%, #e74c3c 100%)',
                  }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white mb-3"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#dc3545"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <h2
                    className="text-white mb-1"
                    style={{ fontWeight: 700, fontSize: '1.75rem' }}
                  >
                    Payment Failed
                  </h2>
                </div>

                <div className="p-4 text-center">
                  <h4 className="fw-bold mb-3">{message}</h4>
                  <p className="text-muted mb-4">
                    Please try again or contact support if the issue persists.
                  </p>
                  <button
                    className="btn btn-outline-primary btn-lg px-5"
                    onClick={() => navigate('/courses')}
                    style={{ borderRadius: '50px' }}
                  >
                    Back to Courses
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
