import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, LoadingController } from '@ionic/angular';
import { WebApiService } from '../services/web-api.service';
import { PreferenceManagerService } from '../services/preference-manager.service';
import { StaticVariable } from '../classes/static-variable';
import { ExFunctions } from '../classes/ex-functions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public username = "";
  
  private loading: any;

  constructor(
    private navCtrl: NavController,
    private api: WebApiService,
    private menu: MenuController,
    private pref: PreferenceManagerService,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController
  ) { }

  ngOnInit () {
    this.navCtrl.navigateRoot(['home/home1']);
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
    console.log(sessionLogin);
    
    
    if (sessionLogin === false) {
      this.navCtrl.navigateRoot(['login']);
    } else {
      await this.refreshData();
    }
    this.dismissLoadCtrl();
  }

  async refreshData () {
    const userId = await this.pref.getData(StaticVariable.USER_ID);
    
    await this.api.GetUserInfo(userId).then(res => {
      this.username = res['result']['name'];
      this.pref.setData(StaticVariable.USERNAME, res['result']['name']);
      return;
    });

    this.username = await this.pref.getData(StaticVariable.USERNAME);
  }

  goToHome () {
    console.log("home");
    this.navCtrl.navigateRoot(['home/home1']);
    this.menu.close();
  }

  goToSetting () {
    console.log("setting");
    this.navCtrl.navigateRoot(['home/settings']);
    this.menu.close();
  }

  async goLogout () {
    console.log("logout");

    // create alert to choose login or not
    const logoutAlert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Logout',
      message: 'Are you sure you want to log out your account?',
      buttons: [
        {
          text: 'Log out',
          handler: async () => {
            // perform log out
            this.createLoadCtrl();

            const userId = await this.pref.getData(StaticVariable.USER_ID);
            this.api.LogoutUser(userId).then(async res => {
              this.dismissLoadCtrl();
              if (res === true) {
                
                await this.pref.setData(StaticVariable.USER_ID, "");
                await this.pref.setData(StaticVariable.DEVICE_ID, "");
                await this.pref.setData(StaticVariable.DATA_ID, "");
                await this.pref.setData(StaticVariable.LAST_LOGIN, "");
                await this.pref.setData(StaticVariable.USERNAME, "");

                this.navCtrl.navigateRoot(['login']);
              } else {
                this.presentAlert("Oops! Cannot logout your account, please try again!")
              }
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // do nothing
          }
        }
      ]
    });

    logoutAlert.present();
    this.menu.close();
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
