import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { FirebaseService } from './../services/firebase.service';

import { Observable } from 'rxjs';
import { map, finalize, first } from 'rxjs/operators'

@Component({
  selector: 'app-retrait',
  templateUrl: './retrait.page.html',
  styleUrls: ['./retrait.page.scss'],
})
export class RetraitPage implements OnInit {
  connect: boolean;
  ideaCollection: AngularFirestoreCollection<any>;
  itemsCollection: AngularFirestoreCollection<any[]>;
  items: Observable<any>;
  itemsCollection1: AngularFirestoreCollection<any[]>;
  items1: Observable<any>;
  categoryCollection: AngularFirestoreCollection<any>;
  category: Observable<any[]>;
  profil: any;
  solde: any;
  infos: any = [];
  //getdata: any;

  constructor(
    private alertController : AlertController,
    private fireauth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.getdata();
  }

  getdata(){
      this.fireauth.authState.subscribe((user)=> {
        if(user){
          this.connect = true ;
        console.log(user);
        console.log(user.email);
        this.itemsCollection = this.afs.collection('User', ref => ref.where('email', '==', user.email));
        this.items = this.itemsCollection.snapshotChanges().pipe(
          map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
          })
        );
          this.items.subscribe(da=>{
          if(da){
            this.profil=da[0];
            console.log(this.profil);
            console.log(this.profil.status);
            this.solde = this.profil.solde;
            console.log(this.profil.credit);
            this.getretraits(this.profil.id);
          }
          else{
            this.connect = false ;
          }

          })

        }
        else{
       this.connect = false ;
        }
      })
  }
  getretraits(id) {
    this.categoryCollection = this.afs.collection<any>('retraits', ref => ref
    .where('user', '==', id));
  this.category = this.categoryCollection.snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as any;
      const id = a.payload.doc.id;
      console.log(data)
      return { id, ...data };

    }))
  ); this.category.subscribe(data => {
    this.infos = data;

   } );
  }

  async retrait(){
    const alert = await this.alertController.create({
      header: 'Demande de retrait',
      message: 'Veuillez entrer le montant que vous souhaitez retirer. Solde actuel : '+this.profil.credit,
      inputs: [
        {
          name: 'solde',
          type: 'number',
          placeholder : 'Exemple: 500'
        },
        {
          name: 'code',
          type: 'number',
          placeholder : 'Votre PIN: 1001'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.solde>this.profil.credit){
              this.presentToast('Le montant à retirer ne peut être supérieur au solde de votre compte');  
            }
            else{
              console.log(this.profil.prenom);
              if (this.profil.prenom==null || this.profil.nom==null || this.profil.prenom=='' || this.profil.nom==''){
                this.presentToast('Veuillez completer votre compte avant de faire cette transaction');  
              }
              else{
                if(data.code==this.profil.pin){
                  console.log('ók');
                  console.log(data.solde);
                  this.afs.collection('retraits').add({
                    user : this.profil.id,
                    credit : data.solde,
                    statut : false,
                    usermail : this.profil.email,
                    userName : this.profil.prenom= ' '+this.profil.nom,
                    visible : true,
                    raison : 'En cours de de validation',
                    approve_user : '',
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    datev : ''
                  });
                  this.presentToast('Demande de retrait envoyée. Veuillez patienter qu\'un admin la valide');  
                }
                else{
                  this.presentToast('Votre Pin ne correspond pas'); 
                }

              }
            }
          }
        }
      ]
    });
    await alert.present();
  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}

