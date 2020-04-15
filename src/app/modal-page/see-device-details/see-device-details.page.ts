import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { WebApiService } from 'src/app/services/web-api.service';
import { StaticVariable } from 'src/app/classes/static-variable';

@Component({
  selector: 'app-see-device-details',
  templateUrl: './see-device-details.page.html',
  styleUrls: ['./see-device-details.page.scss'],
})
export class SeeDeviceDetailsPage implements OnInit {

  public device_id: string = "";
  public device_name: string = "";
  public device_description: string = "";
  public device_last_update: string = "";
  public showQr = false;

  public value = "";
  public loading: any;

  constructor(
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private api: WebApiService
  ) {
    this.device_id = navParams.get('id');
    this.device_name = navParams.get('name');
    this.device_description = navParams.get('description');
    this.device_last_update = navParams.get('last_update');
  }

  ngOnInit() {
  }

  seeQRCode () {
    this.value = this.device_id;
    this.showQr = true;    
  }

  cancelEdit () {
    this.modalCtrl.dismiss();
  }

  async editName () {
    let alert = await this.alertCtrl.create({
      header: "Change device name",
      inputs: [
        {
          name: 'devicename',
          placeholder: 'Device name',
          value: this.device_name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: async data => {
            if (data.devicename === "")
              return;

            this.createLoadCtrl();
            await this.api.EditDeviceInfo(
              this.device_id,
              data.devicename,
              true,
              this.device_description).then(res => {
                this.dismissLoadCtrl();
                if (res === true) {
                  this.presentAlert("Device name has changed!");
                  this.device_name = data.devicename;
                } else {
                  this.presentAlert("Oops! Failed to change device name, try again later!");
                }
            })
          }
        }
      ]
    });
    alert.present();
  }

  async editDesc () {
    let alert = await this.alertCtrl.create({
      header: "Change device description",
      inputs: [
        {
          name: 'devicedescription',
          placeholder: 'Device description',
          value: this.device_description
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: async data => {
            if (data.devicedescription === "")
              return;

            this.createLoadCtrl();
            await this.api.EditDeviceInfo(
              this.device_id,
              this.device_name,
              true,
              data.devicedescription).then(res => {
                this.dismissLoadCtrl();
                if (res === true) {
                  this.presentAlert("Device description has changed!");
                  this.device_description = data.devicedescription;
                } else {
                  this.presentAlert("Oops! Failed to change device description, try again later!");
                }
            })
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * This function is for create the loading controller
   */
  async createLoadCtrl () {

    // create the loading controller
    this.loading = await this.loadCtrl.create({
      message: 'Please wait ...',
      spinner: 'crescent',
      duration: StaticVariable.LOADING_TIME
    })

    // display the loading controller
    this.loading.present();
  }

  /**
   * This function is for dismiss the loading controller
   */
  async dismissLoadCtrl () {

    // remove or dismiss the loading controller
    this.loading.dismiss();
  }

  async presentAlert (msg: string) {
    // gives alert that track is success
    let alert = await this.alertCtrl.create({
      mode: 'ios',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => { }
        }
      ]
    });

    // display the alert controller
    alert.present();
  }

}
