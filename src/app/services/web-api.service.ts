import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  private origin = "";

  constructor(
    public http: HttpClient
  ) { this.origin = window.location.origin; }  

// domain
  private mainDomain: string = "https://myionic-c4817.firebaseapp.com/"
  private domainUser: string = this.mainDomain + "api/v1/User/";
  private domainDevice: string = this.mainDomain + "api/v1/Device/";
  private domainData: string = this.mainDomain + "api/v1/Data/";
  
  private proxy: string = "https://cors-anywhere.herokuapp.com/";

    // api user
    private urlCreateUser : string = this.domainUser + "Create";
    private urlLoginUser : string = this.domainUser + "Login";
    private urlCheckLoginSession : string = this.domainUser + "CheckSessionLogin";
    private urlUpdateLoginSession : string = this.domainUser + "UpdateSessionLogin";
    private urlUserIdUsingEmail : string = this.domainUser + "GetId/";
    private urlUserIdUsingEmailv2 : string = this.domainUser + "GetIdv2";
    private urlUserInfoUsingId : string = this.domainUser + "GetUser/";
    private urlLogoutUser : string = this.domainUser + "Logout";
    private urlChangePassword : string = this.domainUser + "ChangePassword"

    // api device
    private urlCreateDevice : string = this.domainDevice + "Create";
    private urlDeviceAllUsingEmail : string = this.domainDevice + "GetAll/";
    private urlDeviceInfoUsingId : string = this.domainDevice + "GetDevice/";
    private urlDeviceEditInfo : string = this.domainDevice + "UpdateValue";
    private urlDeleteDevice : string = this.domainDevice + "Delete";

    // api data
    private urlCreateData : string = this.domainData + "Create";
    private urlDataAllUsingDevId : string = this.domainData + "GetAll/";
    private urlDataInfoUsingId : string = this.domainData + "GetData/";
    private urlDataEditInfo : string = this.domainData + "UpdateName";
    private urlDeleteData : string = this.domainData + "Delete";

// functions
  // private header = new HttpHeaders().append('Access-Control-Allow-Origin', this.mainDomain);

  async RegisterNewUser (needProxy: boolean = false, name: string, email: string, password: string) {
    let url = this.urlCreateUser;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "name": name,
      "email": email,
      "password": password
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['code'] === 201) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on RegisterNewUser",
          "err": rejc
        });
      })
      .catch((err) => {
        console.log({
          "msg": "Error on RegisterNewUser",
          "err": err
        });
      });

    return returnValue;
  }

  async LoginUser (needProxy: boolean = false, email: string, password: string) {
    let url = this.urlLoginUser;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "email": email,
      "password": password
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {  
        if (res['code'] === 200) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on LoginUser",
          "err": rejc
        });
      })
      .catch((err) => {
        console.log({
          "msg": "Error on LoginUser",
          "err": err
        });
      });

    return returnValue;
  }

  async CheckSessionLogin (needProxy: boolean = false, id: string) {
    let url = this.urlCheckLoginSession;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "id": id
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['status'] === true) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on CheckSessionLogin",
          "err": rejc
        });
      })
      .catch((err) => {
        console.log({
          "msg": "Error on CheckSessionLogin",
          "err": err
        });
      });

    return returnValue;
  }

  async UpdateSessionLogin (needProxy: boolean = false, id: string) {
    let url = this.urlUpdateLoginSession;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "id": id
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['status'] === true) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on UpdateSessionLogin",
          "err": rejc
        });
      })
      .catch((err) => {
        console.log({
          "msg": "Error on UpdateSessionLogin",
          "err": err
        });
      });

    return returnValue;
  }

  async GetUserId (needProxy: boolean = false, email: string) {
    let url = this.proxy + this.urlUserIdUsingEmail + email;

    if (needProxy === true)
      url = this.proxy + url;

    return await this.http.get(url).toPromise()
      .then((res) => {
        return {
          "message": res['msg'],
          "result": res['result']
        };
      }, (rejc) => {
        console.log({
          "msg": "Rejected on GetUserId",
          "err": rejc
        });
        return {
          "message": "error",
          "result": {}
        };
      })
      .catch((err) => {
        console.log({
          "msg": "Error on GetUserId",
          "err": err
        });
        return {
          "message": "error",
          "result": {}
        };
      });
  }

  async GetUserIdv2 (needProxy: boolean = false, email: string) {
    let url = this.urlUserIdUsingEmailv2;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "email": email,
    };

    return await this.http.post(url, postData).toPromise()
      .then((res) => {
        return {
          "message": res['msg'],
          "result": res['result']
        };
      }, (rejc) => {
        console.log({
          "msg": "Rejected on GetUserId",
          "err": rejc
        });
        return {
          "message": "error",
          "result": {}
        };
      })
      .catch((err) => {
        console.log({
          "msg": "Error on GetUserId",
          "err": err
        });
        return {
          "message": "error",
          "result": {}
        };
      });
  }

  async GetUserInfo (needProxy: boolean = false, id: string) {
    let url = this.proxy + this.urlUserInfoUsingId + id;

    if (needProxy === true)
      url = this.proxy + url;

    return await this.http.get(url).toPromise()
      .then((res) => {
        return {
          "message": res['msg'],
          "result": res['result']
        };
      }, (rejc) => {
        console.log({
          "msg": "Rejected on GetUserInfo",
          "err": rejc
        });
        return {
          "message": "error",
          "result": {}
        };
      })
      .catch((err) => {
        console.log({
          "msg": "Error on GetUserInfo",
          "err": err
        });
        return {
          "message": "error",
          "result": {}
        };
      });
  }

  async LogoutUser (needProxy: boolean = false, id: string) {
    let url = this.urlLogoutUser;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "id": id,
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['code'] === 200) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on LogoutUser",
          "err": rejc
        });
      })
      .catch((err) => {
        console.log({
          "msg": "Error on LogoutUser",
          "err": err
        });
      });

    return returnValue;
  }

  async ChangePassword (needProxy: boolean = false, id: string, oldPass: string, newPass: string) {
    let url = this.urlChangePassword;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "id": id,
      "old_password": oldPass,
      "new_password": newPass
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['code'] === 204) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on ChangePassword",
          "err": rejc
        });
      })
      .catch((err) => {
        console.log({
          "msg": "Error on ChangePassword",
          "err": err
        });
      });

    return returnValue;
  }

  async CreateNewDevice (needProxy: boolean = false, name: string, status: boolean, description: string, id_user: string) {
    let url = this.urlCreateDevice;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "name": name,
      "status": status,
      "description": description,
      "id_user": id_user
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['code'] === 201) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on CreateNewDevice",
          "err": rejc
        }); 
      })
      .catch((err) => {
        console.log({
          "msg": "Error on CreateNewDevice",
          "err": err
        }); 
      });

    return returnValue;
  }

  async GetAllDevice (needProxy: boolean = false, email: string) {
    let url = this.proxy + this.urlDeviceAllUsingEmail + email;

    if (needProxy === true)
      url = this.proxy + url;

    return await this.http.get(url).toPromise()
      .then((res) => {
        return {
          "message": res['msg'],
          "result": res['result']
        };
      }, (rejc) => {
        console.log({
          "msg": "Rejected on GetAllDevice",
          "err": rejc
        });
        return {
          "message": "error",
          "result": {}
        };
      })
      .catch((err) => {
        console.log({
          "msg": "Error on GetAllDevice",
          "err": err
        });
        return {
          "message": "error",
          "result": {}
        };
      });
  }

  async GetDeviceInfo (needProxy: boolean = false, id: string) {
    let url = this.proxy + this.urlDeviceInfoUsingId + id;

    if (needProxy === true)
      url = this.proxy + url;

    return await this.http.get(url).toPromise()
      .then((res) => {
        return {
          "message": res['msg'],
          "result": res['result']
        };
      }, (rejc) => {
        console.log({
          "msg": "Rejected on GetDeviceInfo",
          "err": rejc
        });
        return {
          "message": "error",
          "result": {}
        };
      })
      .catch((err) => {
        console.log({
          "msg": "Error on GetDeviceInfo",
          "err": err
        });
        return {
          "message": "error",
          "result": {}
        };
      });
  }

  async EditDeviceInfo (needProxy: boolean = false, id: string, name: string, status: boolean, description: string) {
    let url = this.urlDeviceEditInfo;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "id": id,
      "name": name,
      "status": status,
      "description": description
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['code'] === 204) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on EditDeviceInfo",
          "err": rejc
        }); 
      })
      .catch((err) => {
        console.log({
          "msg": "Error on EditDeviceInfo",
          "err": err
        }); 
      });

    return returnValue;
  }

  async DeleteDevice (needProxy: boolean = false, id: string) {
    let url = this.urlDeleteDevice;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "id": id
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['code'] === 200) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on DeleteDevice",
          "err": rejc
        }); 
      })
      .catch((err) => {
        console.log({
          "msg": "Error on DeleteDevice",
          "err": err
        }); 
      });

    return returnValue;
  }

  async CreateNewData (needProxy: boolean = false, name: string, value: any, id_device: string) {
    let url = this.urlCreateData;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "name": name,
      "value": value,
      "id_device": id_device
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['code'] === 201) {
          returnValue = true
        }
      },(rejc) => {
        console.log({
          "msg": "Rejected on CreateNewData",
          "err": rejc
        }); 
      })
      .catch((err) => {
        console.log({
          "msg": "Error on CreateNewData",
          "err": err
        }); 
      });

    return returnValue;
  }

  async GetAllData (needProxy: boolean = false, id_device: string) {
    let url = this.proxy + this.urlDataAllUsingDevId + id_device;

    if (needProxy === true)
      url = this.proxy + url;

    return await this.http.get(url).toPromise()
      .then((res) => {
        return {
          "message": res['msg'],
          "result": res['result']
        };
      }, (rejc) => {
        console.log({
          "msg": "Rejected on GetAllData",
          "err": rejc
        });
        return {
          "message": "error",
          "result": {}
        };
      })
      .catch((err) => {
        console.log({
          "msg": "Error on GetAllData",
          "err": err
        });
        return {
          "message": "error",
          "result": {}
        };
      });
  }

  async GetDataInfo (needProxy: boolean = false, id: string) {
    let url = this.proxy + this.urlDataInfoUsingId + id;

    if (needProxy === true)
      url = this.proxy + url;

    return await this.http.get(url).toPromise()
      .then((res) => {
        return {
          "message": res['msg'],
          "result": res['result']
        };
      }, (rejc) => {
        console.log({
          "msg": "Rejected on GetDataInfo",
          "err": rejc
        });
        return {
          "message": "error",
          "result": {}
        };
      })
      .catch((err) => {
        console.log({
          "msg": "Error on GetDataInfo",
          "err": err
        });
        return {
          "message": "error",
          "result": {}
        };
      });
  }

  async EditDataInfo (needProxy: boolean = false, id: string, name: string) {
    let url = this.urlDataEditInfo;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "id": id,
      "name": name
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['code'] === 204) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on EditDataInfo",
          "err": rejc
        }); 
      })
      .catch((err) => {
        console.log({
          "msg": "Error on EditDataInfo",
          "err": err
        }); 
      });

    return returnValue;
  }

  async DeleteData (needProxy: boolean = false, id: string) {
    let url = this.urlDeleteData;
    let returnValue = false;

    if (needProxy === true)
      url = this.proxy + url;

    const postData = {
      "id": id
    };

    await this.http.post(url, postData).toPromise()
      .then((res) => {
        if (res['code'] === 200) {
          returnValue = true
        }
      }, (rejc) => {
        console.log({
          "msg": "Rejected on DeleteData",
          "err": rejc
        }); 
      })
      .catch((err) => {
        console.log({
          "msg": "Error on DeleteData",
          "err": err
        }); 
      });

    return returnValue;
  }

}
