import React from 'react';
import {
  Accordion,
  Badge,
  ListGroup,
  Card,
  Form,
  Modal,
} from 'react-bootstrap';

export const PreviewLesson = ({
  showPreview,
  setShowPreview,
  previewLesson,
}) => {
  return (
    <Modal
      show={showPreview}
      onHide={() => setShowPreview(false)}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Preview: {previewLesson?.title || 'Lesson'}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="p-0 bg-dark rounded-bottom d-flex justify-content-center align-items-center"
        style={{ minHeight: '300px' }}
      >
        {previewLesson?.video_url ? (
          <video
            src={previewLesson.video_url}
            controls
            width="100%"
            height="400px"
            style={{ backgroundColor: '#000' }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="p-4 text-center text-white">
            No video available for this preview.
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
