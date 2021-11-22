import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { map, finalize, first } from 'rxjs/operators'


@Component({
  selector: 'app-retraitlist',
  templateUrl: './retraitlist.page.html',
  styleUrls: ['./retraitlist.page.scss'],
})
export class RetraitlistPage implements OnInit {
  categoryCollection: AngularFirestoreCollection<any>;
  category: Observable<any[]>;
  infos: any = [];
  categoryCollection1: AngularFirestoreCollection<any>;
  category1: Observable<any[]>;
  info: any = [];
  profil: any;
  itemsCollection: AngularFirestoreCollection<any[]>;
  items: Observable<any>;
  nom: string;

  constructor(
    private alertController : AlertController,
    private fireauth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.fireauth.authState.subscribe((user) => {
        if (user) {
          console.log(user);
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
          this.items.subscribe(da => {
            if (da) {
              console.log(da);
              this.profil = da[0];
              if(this.profil.status=="super" || this.profil.role=="admin"){
                this.nom = this.profil.prenom +' '+this.profil.nom;
                this.getretraits();
                this
              }
            }
          });

        }
      })
   
  }


  getretraits() {
    this.categoryCollection = this.afs.collection<any>('retraits');
  this.category = this.categoryCollection.snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as any;
      const id = a.payload.doc.id;
     // console.log(data)
      return { id, ...data };

    }))
  ); this.category.subscribe(data => {
    this.infos = data;

   } );
  }

  async update(item){
    console.log(item);
    const alert = await this.alertController.create({
      header: 'Validation',
      message: 'Voulez-vous vraiment valider cette demande de retrait?',
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
            this.getSoldeUser(item.usermail, item);
          }
        }
      ]
    });
    await alert.present();
  }

  getSoldeUser(email, item){
    console.log(item);
    let vart=true;
    this.categoryCollection1 = this.afs.collection<any>('User', ref => ref
    .where('email', '==', email));
  this.category1 = this.categoryCollection1.snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as any;
      const id = a.payload.doc.id;
      console.log(data)
      return { id, ...data };

    }))
  ); this.category1.subscribe(data => {
    this.info = data;
    console.log(this.info[0]);
    console.log(item);
    console.log(item.credit)
    console.log(this.info[0].credit)
    if(vart){
      vart=false;
      if(item.credit<this.info[0].credit){
        console.log(this.info[0].credit)
        console.log(this.info[0])
        console.log(item.credit)
        this.afs.collection('retraits').doc(item.id).update(
          {
            raison : 'Demande approuvée',
            statut : true,
            approve_user : this.nom,
            datev: firebase.firestore.FieldValue.serverTimestamp()
          });
          let cred = parseInt(item.credit)
          this.afs.collection('User').doc(this.info[0].id).update(
            {
              credit:firebase.firestore.FieldValue.increment(-cred)
            });
            this.presentToast('Demande validée');
      }
      else{
        this.presentToast('Solde de l\'utilisateur insuffisant');
      }
    }
   } ); 
  }

  getUser(email){
    this.categoryCollection1 = this.afs.collection<any>('User', ref => ref
    .where('email', '==', email));
    this.category1 = this.categoryCollection1.snapshotChanges().pipe(
      map(actions =>{
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return{ id, ...data};
            console.log(data);
          });
      })
    );
  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
