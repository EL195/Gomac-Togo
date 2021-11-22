import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { MenusComponent } from '../components/menus/menus.component';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { ConnexionMessageComponent } from '../components/connexion-message/connexion-message.component';
import { CompleteComponent } from '../components/complete/complete.component';
import { LoadService } from '../services/load.service';

import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';
import { FcmService } from '../service/fcm.service';
import { RedirectComponent } from '../components/redirect/redirect.component';
import { NotifComponent } from '../components/notif/notif.component';

@Component({
  selector: 'app-bloque',
  templateUrl: './bloque.page.html',
  styleUrls: ['./bloque.page.scss'],
})
export class BloquePage implements OnInit {
  categoryCollection: AngularFirestoreCollection<any>;
  categoryCollections: AngularFirestoreCollection<any>;
  categoryCollectionss: AngularFirestoreCollection<any>;
  category1: Observable<any[]>;
  homeCollection: AngularFirestoreCollection<any>;
  home: Observable<any[]>;
  principal: any = [];
  principals: any = [];
  principalss: any = [];
  principal1: any = [];
  categorys: any;
  category: any;
  categoryss: any;
  correctCategory : any;
  itemsCollection: AngularFirestoreCollection<any[]>;
  items: Observable<any>;
  profil:any;
  connect: boolean;
  role: any;
  redit=-1;
  idUser: any;
  boutique: boolean = false;
  credit: any;
  agent : boolean = false;
  nom: any;
  prenom: any;
  modele: any;
  active: boolean = false;


  constructor(
    public popoverController: PopoverController,
    private fireauth: AngularFireAuth,
    private storage:AngularFireStorage,
    private toastController: ToastController,
    private afAuth: AngularFireAuth,
    private readonly afs: AngularFirestore,
    public router: Router,
    public pour:LoadService,
    private fcmi: FcmService,
    private nativeAudio: NativeAudio,
    private fcm: FCM, public plt: Platform
  ) {}

  ngOnInit() {
          //this.pour.present();
          this.fireauth.authState.subscribe((user)=> {
            if(user){
              this.connect = true ;
            console.log(user);
            this.itemsCollection = this.afs.collection('User', ref => ref.where('email', '==', user.email))
            ;
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
                this.redit=this.profil.credit;
                        //this.pour.dismiss();
                console.log(this.profil);
                console.log(this.profil.status);
                this.role = this.profil.status;
                this.idUser = this.profil.id;
                this.credit = this.profil.credit;
                this.nom = this.profil.nom;
                this.modele= this.profil.modele;
                this.prenom = this.profil.prenom;
                this.active = this.profil.visible;
                if(this.active==true){
                  this.router.navigate(['/tabs/tab1']);
                }
              }
              else{
                this.credit = 0;
                this.connect = false ;
               // this.presentToast("Vous n'êtes pas connecté(e)...");
              }

              })

            }
            else{
           // this.pour.dismiss();
           this.credit = 0;
           this.connect = false ;
          // this.connexionPresent();
            }
          })
  }


  contact(){ 
    this.router.navigate(['/suggestion']);
  }
}
