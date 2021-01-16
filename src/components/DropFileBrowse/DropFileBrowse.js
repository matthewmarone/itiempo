import React from 'react';
// import Files from 'react-files';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const root = {textAlign: "center"};
const DropFileBrowse = props => {
    // eslint-disable-next-line no-unused-vars
    const {onFileChange, onFileError} = props;
    return (
        // <Files
        //   className='files-dropzone'
        //   onChange={onFileChange}
        //   onError={onFileError}
        //   accepts={['image/*',]}
        //   multiple={false}
        //   maxFiles={1}
        //   maxFileSize={10000000}
        //   minFileSize={0}
        //   clickable
        //   style={root}
        // >
          <PhotoLibraryIcon fontSize='large' color='primary' />
        // </Files>
        );
};

DropFileBrowse.propTypes = {
    onFileChange: PropTypes.func.isRequired,
    onFileError: PropTypes.func,
};

export default DropFileBrowse;