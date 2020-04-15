import { Component, OnInit } from '@angular/core';
import { WebApiService } from 'src/app/services/web-api.service';
import { PreferenceManagerService } from 'src/app/services/preference-manager.service';
import { AlertController, LoadingController, Platform, NavController } from '@ionic/angular';
import { StaticVariable } from 'src/app/classes/static-variable';
import { ExFunctions } from 'src/app/classes/ex-functions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  public user_id = "";
  public user_name = "";
  public user_email = "";
  public user_lastupdate = "";

  public loading: any;
  platformDesktop: boolean;

  constructor(
    private api: WebApiService,
    private pref: PreferenceManagerService,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private navCtrl: NavController,
    private plat: Platform
  ) { }

  async ngOnInit() {  
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

  doRefresh(event) {
    // console.log('Begin async operation');
    this.refreshData();

    setTimeout(() => {
      // console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async refreshData () {
    const userId = await this.pref.getData(StaticVariable.USER_ID);
    await this.api.GetUserInfo(true, userId).then(res => {
      const userInfo = res['result'];
      this.user_id = userInfo['id'];
      this.user_name = userInfo['name'];
      this.user_email = userInfo['email'];
      this.user_lastupdate = userInfo['last_update'];
    }).catch();
  }

  // async editProfile () {
  //   let alert = await this.alertCtrl.create({
  //     header: "Edit profile",
  //     subHeader: "You can edit your name, or email address, or both of them",
  //     mode: 'ios',
  //     inputs: [
  //       {
  //         name: 'name',
  //         placeholder: 'Member name',
  //         type: 'text',
  //         value: this.user_name
  //       },
  //       {
  //         name: 'email',
  //         placeholder: 'Email address',
  //         type: 'email',
  //         value: this.user_email
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Save',
  //         handler: async data => {
  //           // this.createLoadCtrl();
  //           // await this.api.Ed.then(res => {
  //           //   if (res === true) {
  //           //     this.dismissLoadCtrl();
  //           //     this.refreshData();
  //           //   } else {
  //           //     this.presentAlert("Oops! Failed to edit your profile, please try again later!")
  //           //   }
  //           // });
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  async changePass () {
    let alert = await this.alertCtrl.create({
      header: "Change password",
      inputs: [
        {
          name: 'oldpass',
          placeholder: 'Old password',
          type: 'password'
        },
        {
          name: 'newpass',
          placeholder: 'New password',
          type: 'password'
        },
        {
          name: 'conf_newpass',
          placeholder: 'Confirm new password',
          type: 'password'
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

            if (data.newpass != data.conf_newpass) {
              this.presentAlert("Password not match!");
              return;
            }

            this.createLoadCtrl();            
            await this.api.ChangePassword(false, this.user_id, data.oldpass, data.newpass).then(async res => {
              
              if (res === true) {
                this.dismissLoadCtrl();
                this.presentAlert("Your password has changed!");
              } else {
                await this.api.ChangePassword(true, this.user_id, data.oldpass, data.newpass).then(res => {

                  if (res === true) {
                    this.dismissLoadCtrl();
                    this.presentAlert("Your password has changed!");
                  } else {
                    this.dismissLoadCtrl();
                    this.presentAlert("Oops! Your old password doesn't match, please try again!");
                  }

                });                
              }
              
            });
          }
        }
      ]
    });
    alert.present();
  }

  // async editName () {
  //   let alert = await this.alertCtrl.create({
  //     header: "Change member name",
  //     inputs: [
  //       {
  //         name: 'devicename',
  //         placeholder: 'Member name',
  //         value: this.user_name
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Save',
  //         handler: async data => {
  //           if (data.devicename === "")
  //             return;

  //           this.createLoadCtrl();
  //           await this.api.(
  //             this.device_id,
  //             data.devicename,
  //             true,
  //             this.device_description).then(res => {
  //               this.dismissLoadCtrl();
  //               if (res === true) {
  //                 this.presentAlert("Device name has changed!");
  //                 this.device_name = data.devicename;
  //               } else {
  //                 this.presentAlert("Oops! Failed to change device name, try again later!");
  //               }
  //           })
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

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
