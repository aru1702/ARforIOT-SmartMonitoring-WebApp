import { Component, OnInit } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PreferenceManagerService } from 'src/app/services/preference-manager.service';
import { StaticVariable } from 'src/app/classes/static-variable';
import { ExFunctions } from 'src/app/classes/ex-functions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public input_email: string;
  public input_password: string;
  
  private loading: any;

  constructor(
    private api: WebApiService,
    private pref: PreferenceManagerService,
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {  }

  performLogin () {
    if (this.input_email === "" || this.input_password === "") {
      this.presentAlert("Please fill all the required form");
      return;
    }

    this.createLoadCtrl();

    this.api.LoginUser(this.input_email, this.input_password).then(async res => {
      if (res === true) {
        let userId = "";
        
        if (userId === "") {
          await this.api.GetUserId(this.input_email).then(res => {
            userId = res['result']['id'];
          });
        }
        
        if (userId === undefined) {
          await this.api.GetUserIdv2(this.input_email).then(res => {
            userId = res['result']['id'];
          });
        }

        if (userId === undefined) {
          this.dismissLoadCtrl();
          this.presentAlert("Failed to perform login, please try again!");
          return;
        }
        
        if (userId != undefined) {
          this.pref.setData(StaticVariable.USER_ID, userId);
          this.pref.setData(StaticVariable.LAST_LOGIN, ExFunctions.getUTCTime());
          this.dismissLoadCtrl();
          this.navCtrl.navigateRoot(['home']);
        }
      } else {
        this.dismissLoadCtrl();
        this.presentAlert("Incorrect email or password!");
      }
    })
  }

  goToRegister () {
    this.navCtrl.navigateForward(['register']);
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
