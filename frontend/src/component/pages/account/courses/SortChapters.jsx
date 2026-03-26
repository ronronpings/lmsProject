import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';

export const SortChapters = ({
  showChapterSortModal,
  handleCloseChapterSortModal,
  setChapters,
  course,
  chapters,
}) => {
  const [chaptersData, setChaptersData] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(chaptersData);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setChaptersData(reorderedItems);
    saveOrder(reorderedItems);
    // saveOrder(reorderedItems, chapters.id);
  };

  const saveOrder = async (updatedChapters) => {
    try {
      const res = await fetch(`${apiUrl}sort-chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //add token for the authorization
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: updatedChapters, course_id: course.id }),
      });
      //Set the lesson data to chapter
      const result = await res.json();
      if (res.ok) {
        // Use SET_CHAPTERS instead of UPDATE_CHAPTER because we want to replace the whole list
        setChapters({ type: 'SET_CHAPTERS', payload: result.data });
        toast.success(result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //use effect to set the chapter data
  useEffect(() => {
    if (chapters) {
      setChaptersData(chapters);
    }
  }, [chapters]);

  return (
    <>
      <Modal
        size="lg"
        show={showChapterSortModal}
        onHide={handleCloseChapterSortModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Sort Chapters</Modal.Title>
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
                  {chaptersData.map((chapter, index) => (
                    <Draggable
                      key={chapter.id}
                      draggableId={`${chapter.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                        >
                          {chapter.title}
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
