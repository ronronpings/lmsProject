import React, { useEffect, useState, useRef } from 'react';
import { Layout } from '../common/Layout';
import { Rating } from 'react-simple-star-rating';
import {
  Accordion,
  Badge,
  ListGroup,
  Card,
  Form,
  Modal,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { apiUrl } from '../common/Config';
import toast from 'react-hot-toast';

//transcribe
import 'regenerator-runtime/runtime';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

//icon
import { FaMicrophone } from 'react-icons/fa';
import { PreviewLesson } from './PreviewLesson';

export const Detail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [courseOutcomes, setCourseOutcomes] = useState([]);
  const [courseRequirements, setCourseRequirements] = useState([]);
  const [courseChapters, setCourseChapters] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Ask me about this course. I can summarize the overview, requirements, and what you will learn.',
    },
  ]);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  //this is for the overview to display the html content
  const overviewHtml = { __html: course?.description ?? '' };
  const [rating, setRating] = useState(4.0);
  const chatContainerRef = useRef(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewLesson, setPreviewLesson] = useState(null);

  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setPreviewLesson(null);
  };

  const handleShowPreview = (lesson) => {
    setPreviewLesson(lesson);
    setShowPreviewModal(true);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`${apiUrl}courses/${id}/details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok || !data.status || !data.data) {
        console.error('Failed to fetch course details:', data.message);
        setCourse({});
        setCourseOutcomes([]);
        setCourseRequirements([]);
        setCourseChapters([]);
        return;
      }
      console.log('Course details', data.data);
      setCourse(data.data);
      setCourseOutcomes(data.data.outcomes ?? []);
      setCourseRequirements(data.data.requirements ?? []);
      setCourseChapters(data.data.chapters ?? []);
      setMessages([
        {
          role: 'assistant',
          content: `Ask me anything about "${data.data.title}". I can explain the overview, requirements, and lessons.`,
        },
      ]);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setCourse({});
      setCourseOutcomes([]);
      setCourseRequirements([]);
      setCourseChapters([]);
    }
  };

  const handleAskAi = async (event) => {
    event.preventDefault();

    const trimmedMessage = chatInput.trim();

    if (!trimmedMessage || !course?.id || chatLoading) {
      return;
    }
    //stop the mic and clear the transcript
    if (listening) {
      SpeechRecognition.stopListening();
    }
    resetTranscript();

    const nextMessages = [
      ...messages,
      {
        role: 'user',
        content: trimmedMessage,
      },
    ];

    setMessages(nextMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${apiUrl}ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          message: trimmedMessage,
          course_id: course.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        toast.error(data.message || 'Unable to get AI response.');
        setMessages([
          ...nextMessages,
          {
            role: 'assistant',
            content:
              'I could not answer that just yet. Please check the AI configuration and try again.',
          },
        ]);
        return;
      }

      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error('Error sending AI chat request:', error);
      toast.error('Unable to reach the AI chat service.');
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content:
            'The AI service is currently unavailable. Please try again in a moment.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  // Mic useeffect
  useEffect(() => {
    if (transcript && listening) {
      setChatInput(transcript);
    }
  }, [transcript, listening]);

  const handleMicrophoneClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      setChatInput('');
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  // AutoScroll on new convo
  useEffect(() => {
    scrollToBottom();
  }, [messages, chatLoading]);

  return (
    <>
      <Layout>
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/courses">Courses</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {course?.title}
              </li>
            </ol>
          </nav>
          <div className="row my-5">
            <div className="col-lg-8">
              <h2>{course?.title}</h2>
              <div className="d-flex">
                <div className="mt-1">
                  <span className="badge bg-green">
                    {course?.category?.name}
                  </span>
                </div>
                <div className="d-flex ps-3">
                  <div className="text pe-2 pt-1">5.0</div>
                  <Rating initialValue={rating} size={20} />
                </div>
              </div>
              <div className="row mt-4">
                {/* <div className="col">
                                <span className="text-muted d-block">Last Updates</span>
                                <span className="fw-bold">Aug 2021</span>
                            </div> */}
                <div className="col">
                  <span className="text-muted d-block">Level</span>
                  <span className="fw-bold">{course?.level?.name}</span>
                </div>
                <div className="col">
                  <span className="text-muted d-block">Students</span>
                  <span className="fw-bold">150,668</span>
                </div>
                <div className="col">
                  <span className="text-muted d-block">Language</span>
                  <span className="fw-bold"> {course?.language?.name}</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="mb-3  h4">Overview</h3>
                    <div dangerouslySetInnerHTML={overviewHtml} />
                  </div>
                </div>
                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="mb-3 h4">What you will learn</h3>
                    <ul className="list-unstyled mt-3">
                      {courseOutcomes.map((outcome, key) => (
                        <li
                          className="d-flex align-items-center mb-2"
                          key={key}
                        >
                          <span className="text-success me-2">&#10003;</span>
                          <span>{outcome.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="mb-3 h4">Requirements</h3>
                    <ul className="list-unstyled mt-3">
                      {courseRequirements.map((requirement, key) => (
                        <li
                          className="d-flex align-items-center mb-2"
                          key={key}
                        >
                          <span className="text-success me-2">&#10003;</span>
                          <span>{requirement.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="h4 mb-3">Course Structure</h3>

                    <Accordion
                      defaultActiveKey={courseChapters.length ? '0' : undefined}
                      id="courseAccordion"
                    >
                      {courseChapters.length > 0 ? (
                        courseChapters.map((chapter, chapterIndex) => (
                          <Accordion.Item
                            eventKey={String(chapterIndex)}
                            key={chapter.id ?? chapterIndex}
                          >
                            <Accordion.Header>
                              {chapter.title}
                              <span className="ms-3 text-muted">
                                {chapter.lessons?.length ?? 0} lessons
                              </span>
                            </Accordion.Header>

                            <Accordion.Body>
                              {chapter.lessons?.length > 0 ? (
                                <ListGroup>
                                  {chapter.lessons.map(
                                    (lesson, lessonIndex) => (
                                      <ListGroup.Item
                                        className="d-flex justify-content-between align-items-center"
                                        key={lesson.id ?? lessonIndex}
                                      >
                                        <div>{lesson.title}</div>

                                        <div className="d-flex align-items-center gap-2">
                                          {lesson.is_free_preview === 'yes' && (
                                            <Badge
                                              bg="primary"
                                              style={{ cursor: 'pointer' }}
                                              onClick={() =>
                                                handleShowPreview(lesson)
                                              }
                                            >
                                              Preview
                                            </Badge>
                                          )}

                                          {lesson.duration > 0 && (
                                            <span className="text-muted">
                                              {lesson.duration} mins
                                            </span>
                                          )}
                                        </div>
                                      </ListGroup.Item>
                                    )
                                  )}
                                </ListGroup>
                              ) : (
                                <p className="text-muted mb-0">
                                  No lessons available.
                                </p>
                              )}
                            </Accordion.Body>
                          </Accordion.Item>
                        ))
                      ) : (
                        <p className="text-muted mb-0">
                          No chapters available.
                        </p>
                      )}
                    </Accordion>
                  </div>
                </div>

                <div className="col-md-12 mt-4">
                  <div className="border bg-white rounded-3 p-4">
                    <h3 className="mb-3 h4">Reviews</h3>
                    <p>Our student says about this course</p>

                    <div className="mt-4">
                      <div className="d-flex align-items-start mb-4 border-bottom pb-3">
                        <img
                          src="https://placehold.co/50"
                          alt="User"
                          className="rounded-circle me-3"
                        />
                        <div>
                          <h6 className="mb-0">
                            Mohit Singh{' '}
                            <span className="text-muted fs-6">Jan 2, 2025</span>
                          </h6>
                          <div className="text-warning mb-2">
                            <Rating initialValue={rating} size={20} />
                          </div>
                          <p className="mb-0">
                            Quisque et quam lacus amet. Tincidunt auctor
                            phasellus purus faucibus lectus mattis.
                          </p>
                        </div>
                      </div>

                      <div className="d-flex align-items-start mb-4  pb-3">
                        <img
                          src="https://placehold.co/50"
                          alt="User"
                          className="rounded-circle me-3"
                        />
                        <div>
                          <h6 className="mb-0">
                            mark Doe{' '}
                            <span className="text-muted fs-6">
                              Jan 10, 2025
                            </span>
                          </h6>
                          <div className="text-warning mb-2">
                            <Rating initialValue={rating} size={20} />
                          </div>
                          <p className="mb-0">
                            Quisque et quam lacus amet. Tincidunt auctor
                            phasellus purus faucibus lectus mattis.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="border rounded-3 bg-white p-4 shadow-sm">
                <Card.Body>
                  {course?.course_small_image && (
                    <img
                      src={course.course_small_image}
                      className="img-fluid rounded mb-3"
                    />
                  )}

                  <h3 className="fw-bold">${course.price}</h3>
                  <div className="text-muted text-decoration-line-through">
                    ${course.cross_price}
                  </div>
                  {/* Buttons */}
                  <div className="mt-4">
                    <button className="btn btn-primary w-100">
                      <i className="bi bi-ticket"></i> Buy Now
                    </button>
                  </div>
                </Card.Body>
                <Card.Footer className="mt-4">
                  <h6 className="fw-bold">This course includes</h6>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="ps-0">
                      <i className="bi bi-infinity text-primary me-2"></i>
                      Full lifetime access
                    </ListGroup.Item>
                    <ListGroup.Item className="ps-0">
                      <i className="bi bi-tv text-primary me-2"></i>
                      Access on mobile and TV
                    </ListGroup.Item>
                    <ListGroup.Item className="ps-0">
                      <i className="bi bi-award-fill text-primary me-2"></i>
                      Certificate of completion
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Footer>
              </div>

              <div className="border rounded-3 bg-white p-4 shadow-sm mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4 className="h5 mb-1">
                      Ask <span className="text-primary">AI</span>ron About This
                      Course
                    </h4>
                    <p className="text-muted mb-0 small">
                      Get a quick summary before you enroll.
                    </p>
                  </div>
                  <Badge bg="success">Beta</Badge>
                </div>

                <div
                  className="border rounded-3 p-3 bg-light"
                  ref={chatContainerRef}
                  style={{ maxHeight: '360px', overflowY: 'auto' }}
                >
                  {messages.map((message, index) => (
                    <div
                      className={`mb-3 d-flex ${
                        message.role === 'user'
                          ? 'justify-content-end'
                          : 'justify-content-start'
                      }`}
                      key={`${message.role}-${index}`}
                    >
                      <div
                        className={`rounded-3 px-3 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-white border'
                        }`}
                        style={{ maxWidth: '90%', whiteSpace: 'pre-wrap' }}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {chatLoading && (
                    <div className="d-flex justify-content-start">
                      <div
                        className="rounded-3 px-3 py-2 bg-white border text-muted"
                        style={{ maxWidth: '90%' }}
                      >
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2 mt-3">
                  {[
                    'Summarize this course for me.',
                    'Is this course beginner friendly?',
                    'What will I learn here?',
                  ].map((prompt) => (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      key={prompt}
                      onClick={() => setChatInput(prompt)}
                      type="button"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                {/* MIC BUTTON DITO */}
                {browserSupportsSpeechRecognition && (
                  <div className="mb-2 text-end d-flex align-items-center justify-content-end">
                    <FaMicrophone
                      size={15}
                      className={listening ? 'text-danger' : 'text-secondary'}
                      onClick={handleMicrophoneClick}
                      style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                      title={listening ? 'Stop Listening' : 'Voice Type'}
                    />

                    {/* TINAWAG NA NATIN YUNG AUDIO WAVE CLASS Galing SCSS! */}
                    {listening && (
                      <div className="audio-wave ms-3">
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                        <div className="wave-bar"></div>
                      </div>
                    )}
                  </div>
                )}

                <Form onSubmit={handleAskAi} className="mt-3">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="Ask about the overview, lessons, or requirements..."
                    />
                  </Form.Group>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-dark flex-grow-1"
                      disabled={chatLoading || !chatInput.trim() || !course?.id}
                      type="submit"
                    >
                      {chatLoading ? 'Asking AI...' : 'Ask AI'}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        {/* Preview Modal */}
        <PreviewLesson
          showPreview={showPreviewModal}
          setShowPreview={handleClosePreview}
          previewLesson={previewLesson}
        />
      </Layout>
    </>
  );
};
