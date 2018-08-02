import React, { Component } from 'react';
import ReactCrop from 'react-image-crop'
import { Button, Form, Message} from 'semantic-ui-react'
import './App.css';
import 'react-image-crop/dist/ReactCrop.css'


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      file: '',
      imageSrc: '',
      crop: '',
      done: false,
      image:'',
      uploading: false,
      error: false,
      errorMessage: ''
    };
    this._handleUpload = this._handleUpload.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onSelectImage = this._onSelectImage.bind(this);
    this._printPreview = this._printPreview.bind(this);
    this._onImageLoaded = this._onImageLoaded.bind(this);
    this._onCropComplete = this._onCropComplete.bind(this);
    this._onCropChange = this._onCropChange.bind(this);
    this._clearInput = this._clearInput.bind(this);
  }

/**
function to clear imput and error/success messages
**/
_clearInput(e) {
  this.setState({
      file: '',
      imageSrc: '',
      uploading: false,
      error: false,
      errorMessage: ''
    });
}
/**
function to simulate uploading image to server
**/
  _handleUpload(imageFile){
      return Promise.resolve("http://lorempixel.com/800/100/cats/");
  }

/**
function to call the _handleUplaod method to upload image to server
**/
  _onSubmit(e) {
    e.preventDefault();
      if(this.state.imageSrc!==''){
        this.setState({
          uploading: true
        });
        const ImageToUpload = new Image();
        ImageToUpload.src = this.state.imageSrc;
        ImageToUpload.height = this.state.crop.y;
        ImageToUpload.width = this.state.crop.x;
        this._handleUpload(ImageToUpload).then(
          (res) => {
            this.setState({
              uploading: false,
              done: true,
              image: ImageToUpload,
            });
            this._clearInput();
          },
          (err) => {
            this.setState({
              errorUploading: true
            });
        });
      }

  }
/**
this function is triggered on clicking the input to select an image
**/
  _onSelectImage(e) {
   
    if(e.target.files && e.target.files.length>0){
      const fileReader = new FileReader();
      const selectedImage = e.target.files[0];
      const imageSize = ((selectedImage.size/1024)/1024).toFixed(4); // MB

      if (imageSize<=1) {

        fileReader.onloadend =() => {
          this.setState({
            file: selectedImage,
            imageSrc: fileReader.result
          });
        };

        fileReader.readAsDataURL(selectedImage);
      }else {
        this.setState({
          error: true,
          errorMessage: "Oops, you hit the maximum image size allowed, please choose one less than 1MB"
        })
      }
    }
  }

  _printPreview(e){
    e.preventDefault();
    let image = new Image();
    image.src= this.state.image.src;
    image.height = this.state.crop.y;
    image.width = this.state.crop.x;
    const windowProp = 'width='+this.state.crop.x+',height ='+this.state.crop.y+',resizable=1, centerscreen=yes, chrome=yes';
    const w = window.open('', windowProp);
     w.document.write(image.outerHTML);
     w.print();
     w.close();
  }

  _onImageLoaded(image){
    this.setState({
      originalImageHeight: image.height,
      originalImageWidth: image.width
    })
  }
  _onCropComplete(crop){
    this.setState({crop});
  }

  _onCropChange(crop) {
    this.setState({crop});
  }

  render() {
    return (
      <div>
        <Form size='large' className='myform' fluid widths='equal' success={this.state.done} error = {this.state.error} onSubmit={this._onSubmit}>
          <Form.Field>
            <input type="file" accept="image/*" value='' placeholder="Choose an image" required onClick={this._clearInput} onChange={this._onSelectImage}/>
          </Form.Field>
          <Form.Field>
          { (this.state.imageSrc && !this.state.uploading) && (
          <ReactCrop
            src={this.state.imageSrc}
            crop={this.state.crop}
            maxWidth={80000/this.state.originalImageWidth}
            maxHeight={10000/this.state.originalImageHeight}
            onImageLoaded={this._onImageLoaded}
            onComplete={this._onCropComplete}
            onChange={this._onCropChange}
          />
        )}
          </Form.Field>
          <Message
            error
            header='Action Forbidden'
            content={this.state.errorMessage}
          />
          <Message 
            success 
            header='Upload Completed' 
            content="Wao, you are such a geek, image successfully uploaded" 
          />
          <br></br>
          <Button type="submit" primary  disabled={this.state.imageSrc===""} loading = {this.state.uploading} onClick={this._onSubmit}>Upload Image</Button>
          <Button secondary disabled={this.state.image.src===""} onClick={this._printPreview}>Print Preview</Button>
        </Form>
       
      </div>
      )
  }
}

export default App;
