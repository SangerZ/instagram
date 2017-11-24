import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';

import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  constructor(
    private af: AngularFire, 
    private camera: Camera, 
    public alerCtrl: AlertController,
    private platform: Platform, 
    private geolocation: Geolocation
  ) { 
    platform.ready().then(() => {

      geolocation.getCurrentPosition().then(pos => {
        console.log('lat: ' + pos.coords.latitude + ', long: ' + pos.coords.longitude);
      });

      const watch = geolocation.watchPosition().subscribe(pos => {
        console.log('lat: ' + pos.coords.latitude + ', long: ' + pos.coords.longitude);
      });
      watch.unsubscribe();
    });

  }

  photos: FirebaseListObservable<any>;

  ngOnInit() {
    this.photos = this.af.database.list('/photos')
  }

  takePhoto() {
    console.log("peanut");

    let confirm = this.alerCtrl.create({
      title: 'Open the camera?',
      message: 'Do you agree to allow us to use your camera?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');

            const option: CameraOptions = {
              quality: 50,
              destinationType: this.camera.DestinationType.DATA_URL,
              targetHeight: 500,
              targetWidth: 500,
              mediaType: this.camera.MediaType.PICTURE,
              correctOrientation: true
            }
            this.camera.getPicture(option).then((imageData) => {
              this.photos.push({ src: "data:image/jpeg;base64," + imageData, likes: 0 });
            }, (err) => {
              console.log(err);
            });
          }
        }
      ]
    });
  }

  deletePhoto(photoKey: string) {
    //this.photos.splice(this.photos.indexOf(photo), 1);
    this.photos.remove(photoKey);
  }

  likePhoto(photoKey: string, likes: number) {
    //photo.likes++;
    this.photos.update(photoKey, { likes: likes + 1 });
  }
}
