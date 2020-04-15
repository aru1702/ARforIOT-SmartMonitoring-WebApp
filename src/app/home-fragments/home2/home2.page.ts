import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, ModalController, Platform } from '@ionic/angular';
import { PreferenceManagerService } from 'src/app/services/preference-manager.service';
import { WebApiService } from 'src/app/services/web-api.service';
import { StaticVariable } from 'src/app/classes/static-variable';
import { SeeDeviceDetailsPage } from 'src/app/modal-page/see-device-details/see-device-details.page';
import { Home1Page } from '../home1/home1.page';
import { ExFunctions } from 'src/app/classes/ex-functions';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.page.html',
  styleUrls: ['./home2.page.scss'],
})
export class Home2Page implements OnInit {

  public sensorList = [];
  public deviceName = "";
  public platformDesktop = true;
  
  private loading: any;

  constructor(
    private navCtrl: NavController,
    private api: WebApiService,
    private pref: PreferenceManagerService,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private plat: Platform
  ) { }

  ngOnInit() {   
    if (this.plat.is("desktop") === true) {
      this.platformDesktop = true;
    } else {
      this.platformDesktop = false;
    }
  }

  async checkSessionLogin () {
    let returnValue = false;
    let secretFlag = false;

    const userId = await this.pref.getData(StaticVariable.USER_ID);
    await this.api.CheckSessionLogin(false, userId).then(async res => {

      if (res === true){
        await this.api.UpdateSessionLogin(false, userId).then().catch();
        await this.pref.setData(StaticVariable.LAST_LOGIN, ExFunctions.getUTCTime());
        returnValue = true
        secretFlag = true;
      } else {
        await this.api.CheckSessionLogin(true, userId).then(async res => {
          if (res === true) {
            await this.api.UpdateSessionLogin(true, userId).then().catch();
            await this.pref.setData(StaticVariable.LAST_LOGIN, ExFunctions.getUTCTime());
            returnValue = true
            secretFlag = true;
          }
        });
      }

      if (secretFlag === false) {
        const lastLL = await this.pref.getData(StaticVariable.LAST_LOGIN);
        returnValue = ExFunctions.checkLocalSession(lastLL);
        await this.pref.setData(StaticVariable.LAST_LOGIN, ExFunctions.getUTCTime());
      }    

    }, () => {
      this.dismissLoadCtrl();
    }).catch(() => {
      this.dismissLoadCtrl();      
    });

    return returnValue;
  }

  async ionViewDidEnter () {
    this.createLoadCtrl();
    const sessionLogin = await this.checkSessionLogin();
    if (sessionLogin === false) {
      this.navCtrl.navigateRoot(['login']);
    } else {
      await this.refreshData();
    }
    this.dismissLoadCtrl();
  }

  async cardClick (id: string) {
    this.pref.setData(StaticVariable.DATA_ID, id);
    this.navCtrl.navigateForward(['home/home3']);
  }

  doRefresh(event) {
    // console.log('Begin async operation');
    this.refreshData();

    setTimeout(() => {
      // console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async refreshData () {
    this.sensorList = [];
    await this.getData();
  }

  async getData () {
    const deviceId = await this.pref.getData(StaticVariable.DEVICE_ID);
    const deviceData = await this.api.GetDeviceInfo(true, deviceId);
    this.deviceName = deviceData['result']['name'];
    const getSensors = await this.api.GetAllData(true, deviceData['result']['id']);
    for (let i = 0 ; i < getSensors['result'].length ; i++) {
      this.sensorList.push(getSensors['result'][i]);
    }    
  }

  async addNewSensor() {
    let alert = await this.alertCtrl.create({
      header: "Add new sensor",
      inputs: [
        {
          name: 'name',
          placeholder: 'Sensor name'
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
            this.createLoadCtrl();
            const deviceId = await this.pref.getData(StaticVariable.DEVICE_ID);
            await this.api.CreateNewData(false, data.name, 0, deviceId).then(async res => {

              if (res === true) {
                await this.refreshData();
              } else {
                await this.api.CreateNewData(false, data.name, 0, deviceId).then(async res => {

                  if (res === true) {
                    await this.refreshData();
                  } else {
                    this.presentAlert("Oops! Failed to add new sensor, please try again later!")
                  }

                });
              }

            });

            this.dismissLoadCtrl();
          }
        }
      ]
    });
    alert.present();
  }

  async seeDetails () {
    this.createLoadCtrl()
    const deviceId = await this.pref.getData(StaticVariable.DEVICE_ID);
    const getDevice = await this.api.GetDeviceInfo(true, deviceId);
    const deviceInfo = getDevice['result'];

    const modal = await this.modalCtrl.create({
      component: SeeDeviceDetailsPage,
      componentProps: deviceInfo
    });
    
    this.dismissLoadCtrl();
    await modal.present();
  }

  async deleteDevice () {
    let alert = await this.alertCtrl.create({
      header: "Delete device",
      message: "Are you sure want to delete this device?",
      buttons: [
        {
          text: 'Delete',
          handler: async data => {
            this.createLoadCtrl()
            const deviceId = await this.pref.getData(StaticVariable.DEVICE_ID);
            await this.api.DeleteDevice(false, deviceId).then(res => {
              this.dismissLoadCtrl();
              if (res === true) {
                this.navCtrl.navigateBack(['home/home1']);
              } else {
                this.presentAlert("Oops! Failed to delete this device, please try again later!");
              }
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
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
  
  backButton () {
    this.navCtrl.navigateBack(['home/home1']);
  }

}
