import { Injectable, NgZone } from '@angular/core';
import { NgxUiLoaderService, NgxUiLoaderConfig } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';


declare global {
  interface Window {
    RTCPeerConnection: RTCPeerConnection;
    mozRTCPeerConnection: RTCPeerConnection;
    webkitRTCPeerConnection: RTCPeerConnection;
  }
}
export const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  minTime: 300,
  overlayColor: "rgba(0, 0, 0, 0.32)",
  fgsColor: "#5d78ff"
};
@Injectable({
  providedIn: 'root'
})
export class HelperService {


  constructor(private ngxService: NgxUiLoaderService, private zone: NgZone) { }

  static GetCurrentDateTime()
  {
    var currentdate = new Date(); 
    var datetime = (currentdate.getDate() < 10 ? '0'+currentdate.getDate() : currentdate.getDate()) + "/"
                    + (currentdate.getMonth()+1 < 10 ? '0'+(currentdate.getMonth()+1) : currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " "  
                    + (currentdate.getHours() < 10 ? '0'+currentdate.getHours() : currentdate.getHours()) + ":"  
                    + (currentdate.getMinutes() < 10 ? '0'+currentdate.getMinutes() : currentdate.getMinutes()) + ":" 
                    + (currentdate.getSeconds() < 10 ? '0'+currentdate.getSeconds() : currentdate.getSeconds());
    return datetime;
  }

  static GetDateStringFromDateTime(date)
  {
    var currentdate = new Date(date); 
    var datetime = (currentdate.getDate() < 10 ? '0'+currentdate.getDate() : currentdate.getDate()) + "/"
                    + (currentdate.getMonth()+1 < 10 ? '0'+(currentdate.getMonth()+1) : currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " "  
                    + (currentdate.getHours() < 10 ? '0'+currentdate.getHours() : currentdate.getHours()) + ":"  
                    + (currentdate.getMinutes() < 10 ? '0'+currentdate.getMinutes() : currentdate.getMinutes()) + ":" 
                    + (currentdate.getSeconds() < 10 ? '0'+currentdate.getSeconds() : currentdate.getSeconds());
    return datetime;
  }

  static NotificationType: string[] = [
    "Comment",
    "ProjectAdd",
    "ProjectRemove",
    "CardAdd",
    "CardRemove",
  ]

  //#region Client side encryption functions
  encodeData(data): any {
    return (window.btoa(data));
  }

  decodeData(data): any {
    if (data)
      return (window.atob(data));
    else
      return null;
  }
  //#endregion Client side encryption functions

  //region Loader

  startPageLoader() {
    this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
  }
  stopPageLoader() {
    this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
  }

  startPageLoaderById(id) {
    this.ngxService.startLoader(id);
  }
  stopPageLoaderById(id) {
    this.ngxService.stopLoader(id);
  }

  //endregion Loader

  printHTML(data, heading) {
    var jdata = JSON.stringify(data);
    var params = [
      'height=' + screen.height,
      'width=' + screen.width,
      'fullscreen=yes' // only works in IE, but here for completeness
    ].join(',');
    var mywindow = window.open('', heading, params);
    mywindow.document.write('<html><head><title>' + heading + '</title>');

    mywindow.document.write('</head><body>');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus()
    mywindow.print();
    mywindow.close();
    return true;
  }

  replaceSpecialCharacters(value) {
    return value.replace(/[/\\?%*:|"<>]/g, '-');
  }

  downloadHTML_To_PDF(content, filename: string) {

  }

  alertMessage(title, html, type) {
    return Swal.fire(title, html, type);
  }

  confirm(_title = "Confirm", _html) {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: _title,
        html: _html,
        type: "question",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          resolve(true);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          resolve(false);
        }
      })
    });
  }

  chainSwal(questions) {
    return new Promise((resolve, reject) => {
      Swal.mixin({
        confirmButtonText: 'Yes &rarr;',
        // cancelButtonText: 'No',
        // showCancelButton: true,
      }).queue(questions).then((result) => {
        
        if (result.value) {
          resolve(result.value);
        }
        else {
          resolve(false);
        }
      })
    });
  }

  confirmationCountDown(seconds) {
    let timerInterval;
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: 'Final Confirmation!',
        html:  `Changes will be applied in <b>${seconds}</b> seconds.`,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Cancel ',
        timer: (seconds*1000),
        onBeforeOpen: () => {
          //Swal.showLoading()
          let thisSwal = Swal;
          timerInterval = setInterval(() => {
            thisSwal.getContent().querySelector('b')
              .textContent = Math.round(thisSwal.getTimerLeft()/1000).toString()
          }, 1000)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
       
        if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.close || result.dismiss === Swal.DismissReason.esc) {
          //console.log('I was closed by user')
          resolve(false);
        }   
        if (result.dismiss === Swal.DismissReason.timer) {
          //console.log('I was closed by the timer')
          resolve(true);
        }
        else{
          resolve(true);
        }
      })
    });
  }

  calcMonthDiff(from, to): number {
    const fromDate: Date = this.createDateFromNgbDate(from);
    const toDate: Date = this.createDateFromNgbDate(to);
    const daysDiff = Math.round((Math.abs(<any>fromDate - <any>toDate) / (1000 * 60 * 60 * 24)) / 30);
    return daysDiff;
  }

  calcDiff(from, to) {
    const fromDate: Date = new Date(from);
    const toDate: Date = new Date(to);
    const daysDiff = Math.floor((Math.abs(<any>fromDate - <any>toDate) / (1000 * 60 * 60 * 24)) / 30);

    var diff = Math.floor((Math.abs(toDate.getTime() - fromDate.getTime())));
    var secs = Math.floor(diff / 1000);
    var mins = Math.floor(secs / 60);
    var hours = Math.floor(mins / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 31);
    var years = Math.floor(months / 12);
    months = Math.floor(months % 12);
    days = Math.floor(days % 31);
    hours = Math.floor(hours % 24);
    mins = Math.floor(mins % 60);
    secs = Math.floor(secs % 60);
    var message = "";
    if (years > 0) {
      message += years + (years > 1 ? "years" : "year");
    } else if (months > 0) {
      message += months + (months > 1 ? "months" : "month");
    } else if (days > 0) {
      message += days + (days > 1 ? "days" : "day");
    } else if (hours > 0) {
      message += hours > 0 ? (hours + (hours > 1 ? "hours" : "hour")) : "";
    } else if (mins > 0) {
      message += mins > 0 ? (mins + (mins > 1 ? "mins" : "min")) : "";
    } else if (secs > 0) {
      message += secs + "secs";
    }
    return message;
  }

  createDateFromNgbDate(ngbDate: NgbDate): Date {
    const date: Date = new Date(Date.UTC(ngbDate.year, ngbDate.month, ngbDate.day));
    return date;
  }

  getResponseJson(s) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(s, "text/xml")
    var result = xmlDoc.getElementsByTagName("string")[0].childNodes[0].nodeValue;
    return JSON.parse(result);

  }

  private getRTCPeerConnection() {
    return window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
  }
  private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);
  getLocalIP() {
    return new Promise<string>((resolve, reject) => {
      if (window) {
        window.RTCPeerConnection = this.getRTCPeerConnection();

        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');
        pc.createOffer().then(pc.setLocalDescription.bind(pc));

        pc.onicecandidate = (ice) => {
          this.zone.run(() => {
            if (!ice || !ice.candidate || !ice.candidate.candidate) {
              return;
            }

            let localIp = this.ipRegex.exec(ice.candidate.candidate)[1];
            resolve(localIp);
            pc.onicecandidate = () => { };
            pc.close();
          });
        };
      }
      else {
        resolve("");
      }
    });
  }

  ConvertHrsToHrsAndMin(hours) {
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    if (rminutes > 0) {
      return (rhours > 0 ? (rhours + " hrs ") : "") + rminutes + " mins";
    }
    else {
      return rhours + " hrs ";
    }
  }

  GetTotalHoursFromNow(date) {
    // get total seconds between the times
    var delta = Math.abs(+new Date(date) - +new Date()) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = Math.floor(delta % 60);  // in theory the modulus is not required

    return (days > 0 ? days + " day " : "") + (hours > 0 ? hours + " hrs " : "") + (minutes > 0 ? minutes + " mins " : "") + (seconds > 0 ? seconds + " secs " : "")
  }
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return control && control.invalid && isSubmitted;
  }
}

export class MyProjectErrorStateMatcher implements ErrorStateMatcher 
{
  isSubmitted: boolean
  /**
   *
   */
  constructor(submitted) {
    this.isSubmitted = submitted
  }
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return control && control.invalid && this.isSubmitted;
  }
}