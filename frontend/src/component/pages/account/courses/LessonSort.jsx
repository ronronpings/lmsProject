import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { apiUrl, getToken } from '../../../common/Config';
import toast from 'react-hot-toast';
export const LessonSort = ({
  showLessonSort,
  handleCloseLessonSort,
  lessonSortData,
  setChapters,
  chapterId,
}) => {
  const [lessons, setLessons] = useState(lessonSortData || []);

  useEffect(() => {
    if (lessonSortData) {
      setLessons(lessonSortData);
    }
  }, [lessonSortData, showLessonSort]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(lessons);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setLessons(reorderedItems);
    saveOrder(reorderedItems);
  };

  const saveOrder = async (updatedLessons) => {
    try {
      const res = await fetch(`${apiUrl}sort-lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ text: updatedLessons, chapter_id: chapterId }),
      });
      //Set the lesson data to chapter
      const result = await res.json();
      setChapters({ type: 'UPDATE_CHAPTER', payload: result.data });
      console.log('This is result', result.data);
      toast.success(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal size="lg" show={showLessonSort} onHide={handleCloseLessonSort}>
        <Modal.Header closeButton>
          <Modal.Title>Sort Lesson</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {lessons.map((lesson, index) => (
                    <Draggable
                      key={lesson.id}
                      draggableId={`${lesson.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                        >
                          {lesson.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
