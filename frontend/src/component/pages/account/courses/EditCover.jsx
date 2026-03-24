import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { apiUrl, token } from '../../../common/Config';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);
export const EditCover = ({ course, setCourse }) => {
  const [files, setFiles] = useState([]);
  const params = useParams();

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <div className="d-flex">
            <h4 className="h5 mb-3">Edit Cover</h4>
          </div>
          <FilePond
            acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
            credits={false}
            files={files}
            onupdatefiles={setFiles}
            allowMultiple={false}
            maxFiles={1}
            server={{
              url: apiUrl,
              process: {
                url: `save-course-image/${params.id}`,
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                onload: (response) => {
                  response = JSON.parse(response);
                  toast.success(response.message);
                  const updateCourseData = {
                    ...course,
                    course_small_image: response.data.course_small_image,
                  };
                  setCourse(updateCourseData);
                  setFiles([]);
                },
                onerror: (errors) => {
                  console.log(errors);
                },
              },
            }}
            name="image"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
          {
            //show current image
            course.course_small_image && (
              <img
                src={course.course_small_image}
                className="w-100 rounded"
              ></img>
            )
          }
        </div>
      </div>
    </>
  );
};
