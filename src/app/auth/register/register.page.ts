import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { WebApiService } from 'src/app/services/web-api.service';
import { StaticVariable } from 'src/app/classes/static-variable';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public input_name: string = "";
  public input_email: string = "";
  public input_password: string = "";
  public input_re_password: string = "";
  
  private loading: any;

  constructor(
    private api: WebApiService,
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  performRegister () {
    if (this.input_name === "" || this.input_email === "" || this.input_password === "" || this.input_re_password === "") {
      this.presentAlert("Please fill all the required form");
      return;
    }
    
    if (this.input_password != this.input_re_password) {
      this.presentAlert("Password not match!");
      return;
    }

    this.createLoadCtrl();
    this.api.RegisterNewUser(this.input_name, this.input_email, this.input_password).then(async res => {
      this.dismissLoadCtrl();
      if (res === true) {
        this.navCtrl.navigateBack(['login']);
      } else {
        this.presentAlert("This email has been registered!");
      }
    })
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
