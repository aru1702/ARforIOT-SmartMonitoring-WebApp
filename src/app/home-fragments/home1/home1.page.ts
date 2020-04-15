import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { WebApiService } from 'src/app/services/web-api.service';
import { PreferenceManagerService } from 'src/app/services/preference-manager.service';
import { StaticVariable } from 'src/app/classes/static-variable';
import { ExFunctions } from 'src/app/classes/ex-functions';

@Component({
  selector: 'app-home1',
  templateUrl: './home1.page.html',
  styleUrls: ['./home1.page.scss'],
})
export class Home1Page implements OnInit {

  public deviceList = [];
  
  private loading: any;

  constructor(
    private navCtrl: NavController,
    private api: WebApiService,
    private pref: PreferenceManagerService,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
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
    this.pref.setData(StaticVariable.DEVICE_ID, id);
    this.navCtrl.navigateForward(['home/home2']);
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
    this.deviceList = [];
    await this.getData();
  }

  async getData () {
    const userId = await this.pref.getData(StaticVariable.USER_ID);
    const userData = await this.api.GetUserInfo(true, userId);
    const getDevices = await this.api.GetAllDevice(true, userData['result']['email']);
    for (let i = 0 ; i < getDevices['result'].length ; i++) {
      const getData = await this.api.GetAllData(true, getDevices['result'][i]['id']);
      const countData = getData['result'].length;
      this.deviceList.push({
        "deviceInfo": getDevices['result'][i],
        "countData": countData
      });
    }
  }

  async addNewDevice() {
    let alert = await this.alertCtrl.create({
      header: "Add new device",
      inputs: [
        {
          name: 'name',
          placeholder: 'Device name'
        },
        {
          name: 'description',
          placeholder: 'Device description'
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
            this.createLoadCtrl()
            const userId = await this.pref.getData(StaticVariable.USER_ID);
            
            await this.api.CreateNewDevice(false, data.name, true, data.description, userId).then(async res => {
              
              if (res === true) {
                await this.refreshData();
              } else {
                await this.api.CreateNewDevice(true, data.name, true, data.description, userId).then(async res => {
                  
                  if (res === true) {
                    await this.refreshData();
                  } else {
                    this.presentAlert("Oops! Failed to add new device, please try again later!")
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
