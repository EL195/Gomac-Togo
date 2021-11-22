import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Platform, AlertController, ModalController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage'
import { Router } from '@angular/router';
import { ContactsService } from "src/app/services/contacts.service";
import * as firebase from 'firebase';
import { RechercheComponent } from 'src/app/recherche/recherche.component';
import { ValidationComponent } from 'src/app/validation/validation.component';
import { SoldeService } from '../services/solde.service';
import { FirebaseService } from '../services/firebase.service';
import { LoadService } from '../services/load.service';
import { AuthService } from '../services/auth.service';
@Component({
    selector: 'app-listusers',
    templateUrl: './listusers.page.html',
    styleUrls: ['./listusers.page.scss'],
  })
  export class ListusersPage implements OnInit {
    transporteur:any[];
    plati:any[];
    itemsCollection: AngularFirestoreCollection<any[]>;
  items: Observable<any>;
  transCollection: AngularFirestoreCollection<any[]>;
  trans: Observable<any>;
  uploadPercent: Observable<number>;
  profil: any;
  redit: any;
  role: any;
  idUser: any;
  credit: any;
  constructor(public notifie:SoldeService,public contactsService: ContactsService,private storage:AngularFireStorage, private afAuth: AngularFireAuth,public pour:LoadService,public gps:AuthService,
    private camera: Camera,private fireauth: AngularFireAuth, private router: Router, private toastController: ToastController, private platform: Platform, public loadingController: LoadingController,
    public alertController: AlertController,
    private afs: AngularFirestore,private database: AngularFirestore,
    public servfire:FirebaseService,    public modalController: ModalController,) { }

  ngOnInit() {
    this.itemsCollection = this.afs.collection('User')
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
     this.transporteur=da;
     this.plati=da;
      })
      this.mine();
  }
redic(e){
    console.log(e);
    this.afs.collection('User').doc(e).update({visible:true});
}


mine(){
  this.fireauth.authState.subscribe((user)=> {
    if(user){
      //this.connect = true ;
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
                this.pour.dismiss();
        console.log(this.profil);
        console.log(this.profil.status);
        this.role = this.profil.status;
        this.idUser = this.profil.id;
        this.credit = this.profil.credit;
      }
      else{
        this.credit = 0;
      }
       
      })

    }
    else{
    }
  })
}
filterList(evt) {
    // this.foodList = await this.initializeItems();
     const searchTerm = evt.target.value;
     this.plati=this.transporteur;
   console.log(searchTerm);
   console.log(searchTerm.length);
     if (!searchTerm ||  0>= searchTerm.length ) {
       console.log(searchTerm.length);
       this.plati=this.transporteur;
     }else{

     this.plati = this.plati.filter(currentFood => {
       if (currentFood.nom && searchTerm) {
         console.log(currentFood)
         return (currentFood.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||currentFood.nom.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
       }
     });}
   }

   edit(item){
    this.router.navigate(['/edit-user', item]);
   }
}
