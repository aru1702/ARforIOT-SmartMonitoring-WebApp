import { Component, OnInit } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { PreferenceManagerService } from 'src/app/services/preference-manager.service';
import { StaticVariable } from 'src/app/classes/static-variable';
import { ExFunctions } from 'src/app/classes/ex-functions';

@Component({
  selector: 'app-home3',
  templateUrl: './home3.page.html',
  styleUrls: ['./home3.page.scss'],
})
export class Home3Page implements OnInit {

  public sensor_id = "";
  public sensor_name = "";
  public sensor_value = "";
  public sensor_lastupdate = "";

  loading: any;

  constructor(
    private api: WebApiService,
    private pref: PreferenceManagerService,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async checkSessionLogin () {
    let returnValue = false;

    const userId = await this.pref.getData(StaticVariable.USER_ID);
    await this.api.CheckSessionLogin(userId).then(async res => {

      let secretFlag = false;
      
      if (res === true) {
        await this.api.UpdateSessionLogin(userId).then().catch();
        await this.pref.setData(StaticVariable.LAST_LOGIN, ExFunctions.getUTCTime());
        returnValue = true
        secretFlag = true;
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

  doRefresh(event) {
    // console.log('Begin async operation');
    this.refreshData();

    setTimeout(() => {
      // console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async deleteSensor () {
    let alert = await this.alertCtrl.create({
      header: "Delete sensor",
      message: "Are you sure want to delete this sensor?",
      buttons: [
        {
          text: 'Delete',
          handler: async data => {
            this.createLoadCtrl()
            const dataId = await this.pref.getData(StaticVariable.DATA_ID);
            await this.api.DeleteData(dataId).then(res => {
              this.dismissLoadCtrl();
              if (res === true) {
                this.navCtrl.navigateBack(['home/home2']);
              } else {
                this.presentAlert("Oops! Failed to delete this sensor, please try again later!");
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

  async editName () {
    let alert = await this.alertCtrl.create({
      header: "Change sensor name",
      inputs: [
        {
          name: 'sensorname',
          placeholder: 'Sensor name',
          value: this.sensor_name
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
            if (data.sensorname === "")
              return;

            this.createLoadCtrl();
            await this.api.EditDataInfo(
              this.sensor_id,
              data.sensorname).then(res => {
                this.dismissLoadCtrl();
                if (res === true) {
                  this.presentAlert("Sensor name has changed!");
                  this.sensor_name = data.sensorname;
                } else {
                  this.presentAlert("Oops! Failed to change sensor name, try again later!");
                }
            })
          }
        }
      ]
    });
    alert.present();
  }

  async refreshData () {
    const dataId = await this.pref.getData(StaticVariable.DATA_ID);
    await this.api.GetDataInfo(dataId).then(res => {
      const userInfo = res['result'];
      this.sensor_id = userInfo['id'];
      this.sensor_name = userInfo['name'];
      this.sensor_value = userInfo['value'];
      this.sensor_lastupdate = userInfo['last_update'];
    }).catch();
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
    this.navCtrl.navigateBack(['home/home2']);
  }

}
