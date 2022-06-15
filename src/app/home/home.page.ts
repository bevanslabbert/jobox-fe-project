import { Component, ViewChild } from '@angular/core';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { IonDatetime, ToastController } from '@ionic/angular';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('startDate') startCal: IonDatetime;
  @ViewChild('endDate') endCal: IonDatetime;

  private startDate  = '[Start Date]';
  private endDate    = '[End Date]';
  private name       = '[Client Name]';
  private amount     = '[Amount]';
  private service    = '[Service Description]';
  private pdfObj     = null;

  constructor(private toastController: ToastController) {
  }

  clearClientNameInput() {
    this.name = '';
    const inp = document.getElementById('client-name');
    inp.style.backgroundColor = 'transparent';
  }

  confirmStart() {
    this.startDate = this.startCal.value.substring(0,10);
    const inp = document.getElementById('start');
    inp.style.backgroundColor = 'transparent';
  }

  confirmEnd() {
    this.endDate = this.endCal.value.substring(0,10);
    const inp = document.getElementById('end');
    inp.style.backgroundColor = 'transparent';
  }

  clearAmount() {
    this.amount = '';
    const inp = document.getElementById('payment-amount');
    inp.style.backgroundColor = 'transparent';
  }

  clearService() {
    this.service = '';
    const inp = document.getElementById('service-description');
    inp.style.backgroundColor = 'transparent';
  }

  download() {
    if(this.name === '[Client Name]' || this.name === '') {
      this.presentToast('Enter client name!');
    }
    else if(this.service === '[Service Description]' || this.service === '') {
      this.presentToast('Enter service description!');
    }
    else if(this.startDate === '[Start Date]' || this.startDate === '') {
      this.presentToast('Enter service description!');
    }
    else if(this.endDate === '[End Date]' || this.endDate === '') {
      this.presentToast('Enter service description!');
    }
    else {
      this.generatePDF();
      this.presentToast('PDF Downloaded!');
    }
  }

  generatePDF() {
    const docDefinition = {
      content : [
        {
          text: 'FIXED TERM AGEEMENT\n\n', style: 'header'
        },
        {
          text: 'between\n\n', style : 'paragraph'
        },
        {
          text: 'BMF ATTORNEYS with company registration number 2022/123456/07\n\n',  style : 'paragraph',bold: true
        },
        {
          text: 'and\n\n'
        },
        {
          text: this.name + '\n\n\n', style : 'paragraph', preserveLeadingSpaces : true, bold : true
        },
        {
          text: 'Collectively referred herein as the "parties"\n', pageBreak: 'after', style : 'paragraph'
        },
        {
          ol :[
            ['Payment Terms:\n\n',
            {
              ul: [
                  'BMF Attorney\'s fee ' + this.amount + ' (excluding VAT). The retainer fee can be paid upfront, or month-to-month and the payment terms can be payable as follows:\n',
                  {
                    ul :[
                      'Upfront:\n',
                      {
                        ul: [
                          'Three-twelfths of the fee during the probation period in 3 equal instalments by the 7th day of each month\n',
                          'Nine-twelfths of the fee upon conclusion of the probation period of employment payable on the 7th day of the 4th month.\n'
                        ]
                      },
                      'Month-to-month:\n',
                      {
                        ul: [
                          'The month-to-month fee shall be paid by the 7th day of each month\n'
                        ]
                      },
                    ]
                  },
                  'No variation or amendment to this Agreement shall be of any effect unless such amendment is put in writing and signed by all parties\n',
                  'Any documentation prepared by BMF Attorneys remains its property\n\n',
              ]
            }],
            ['Appointment:\n\n',
            {
              text: '2.1.\tThe Client has procured the services of BMF Attorneys and hereby accepts the appointment as an independent contractor of the Client for a fixed period of time.\n\n2.2\tThe reason for this fixed-term contract is for the appointment and completion of the ' + this.service + '\n\n\n'
            }],
            ['Duration\n\n',
            {
              text: '3.1\tNotwithstanding the date of signature hereof, this fixed term contract shall be deemed to have commenced on the ' + this.startDate + ' and will terminate, without further notice, on the ' + this.endDate + '.\n\n3.2\tThe automatic termination of the contract on the Termination Date shall not be construed as a dismissal but as the completion of a fixed term contract.\n\n', pageBreak : 'after'
            }],
            [{
              text:'\n\n\n\n'
          }]
          ]
          
        },
        {
            text: 'Signed at\t\t\t\t\t\t\t\t\t\t\t\t on\n\n\n.....................................\nWho warrants autority on behalf of Jobox\n\n\n\n'
        },
        {
          text: 'Signed at\t\t\t\t\t\t\t\t\t\t\t\t on\n\n\n.....................................\nWho warrants autority on behalf of Jobox'
        }

      ],
      styles: {
        header: {
          fontSize: 25,
          bold: true
        },
        centered: {
          preserveLeadingSpaces: true
        },
        subheader: {
          fontSize: 25,
          bold: true
        },
        // paragraph: {
        //   fontSize: 13
        // },
        defaultStyle: {
          fontSize: 16,
        }
      }
   };

    const options = {
      documentSize: 'A4',
      type: 'share',
      fileName: 'Generated PDF.pdf'
    };

    this.pdfObj = pdfMake.createPdf(docDefinition);
    console.log(this.pdfObj);


    this.pdfObj.download(this.name + '-BMF_ATTORNEYS_FTA');
  }

  async presentToast(s: string) {
    const toast = await this.toastController.create({
      message: s,
      duration: 2000
    });
    toast.present();
  }
}
