import { SoldeService } from './../services/solde.service';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './../services/firebase.service';
import { AuthService } from './../services/auth.service';
import { LoadService } from './../services/load.service';
/*import { AuthService } from './services/auth.service';
import { LoadService } from './services/load.service';
import { FirebaseService } from './services/firebase.service';*/
import { Router, ActivatedRoute, ParamMap } from '@angular/router'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { switchMap } from 'rxjs/operators';

import { GoogleMaps, GoogleMapsEvent, LatLng, MarkerOptions, Marker } from "@ionic-native/google-maps";

import { Platform } from "@ionic/angular";
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-colis',
  templateUrl: './colis.page.html',
  styleUrls: ['./colis.page.scss'],
})
export class ColisPage implements OnInit {
  engin=["Moto","Taxi","Motocyclette","Bus","Personel","Camions","Grumier"];
  timeouti:boolean;
demande={
  type:"",
  date:new Date(),
  villedepart:"",
  villearrive:"",
  depart:"",
  photo:"",
  departlat:0,
  departlong:0,
  arrive:"",
  arrivelat:0,
  arrivelong:0,
  engin:"",
  idClient:"",
  idConducteur:"",
  idCommande:"",
  visible:true,
  status:false,
  prix:0
};
km=250;
depart;arrive:Marker;
markers:Marker[];
markes:Marker[];
ideaCollection: AngularFirestoreCollection<any>;
itemsCollection: AngularFirestoreCollection<any[]>;
items: Observable<any>;
transCollection: AngularFirestoreCollection<any[]>;
uploadPercent: Observable<number>;
itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;
profil:any;
name:any;
//demande:any;
client={
  nom:"",
  prenom:"",
  tel:1,

}
conducteur={
  nom:"",
  prenom:"",
  tel:1,
  photo:"",

}
commande=false;
stt="";
constructor(public notifie:SoldeService,private route: ActivatedRoute,public platform: Platform,private storage:AngularFireStorage, private afAuth: AngularFireAuth,public pour:LoadService,public gps:AuthService,
  private camera: Camera,
  private callNumber: CallNumber,
  private fireauth: AngularFireAuth, private router: Router, private toastController: ToastController, public loadingController: LoadingController,
  public alertController: AlertController,private afs: AngularFirestore,private database: AngularFirestore,public servfire:FirebaseService)
   {

   }




  async ngOnInit() {
    this.pour.dismiss();
 this.pour.present();
 //this.route.paramMap.pipe(
//  switchMap((params) => {

 // })
//);
await this.fireauth.authState.subscribe((user)=> {
  this.name =  this.route.snapshot.paramMap.get('id')
  this.pour.dismiss();
  // console.log(params);
   console.log( this.name);
  if(user){
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
      this.stt= this.profil.status;

      //this.pour.dismiss();
      console.log(this.profil);
      this.information(this.name);
  //	  this.transport(this.profil);    }
     } else{
      //alert("vous n'etes pas connecter");
      this.presentToast("vous n'etes pas connecter");
      this.pour.dismiss();
    }

    })

  }
  else{
  this.pour.dismiss();
  }
}

)
}
async presentToast(message) {
  const toast = await this.toastController.create({
    message: message,
    duration: 3000
  });
  toast.present();
}
  information(name: any) {
    console.log(name);
    this.itemDoc =this.afs.collection('Transport').doc(name);
     this.itemDoc.valueChanges().subscribe((data ) => {
      console.log(data);
      let daterec=data.date.seconds * 1000+5*60*1000;
      let daterecom=new Date().getTime();
      let de=new Date(daterec).getTime();
if(de>daterecom){
    this.timeouti=true;
}else{
    this.timeouti=false;
}
//alert(this.timeouti);
      this.demande=data;
      if(this.demande.idCommande && this.demande.idCommande!="")
      {
        this.commande=true;
      }
      this.km=this.gps.calculateDistance(data.departlat,data.arrivelat,data.departlong,data.arrivelong);
      this.afs.collection('User').doc(this.demande.idClient).valueChanges().subscribe((da:any) => {
this.client.nom=da.nom;
this.client.prenom=da.prenom;
this.client.tel=da.tel;
console.log(da);
this.pour.dismiss();
      });
if(this.demande.idConducteur !=""){
      this.afs.collection('User').doc(this.demande.idConducteur).valueChanges().subscribe((da:any) => {
        this.conducteur.nom=da.nom;
        this.conducteur.prenom=da.prenom;
        this.conducteur.tel=da.tel;
        if(da.photoEngin){
          this.conducteur.photo=da.photoEngin;
        }
        console.log(da);
        this.pour.dismiss();
              });}
    //  this.pour.dismiss();
    });
   // console.log(this.item);
  }

save()
{

  let objet="Validation de la Course";
  let message="La demande de course émit par "+ this.client.nom+" de numéro de téléphone "+this.client.tel+" allant de "+this.demande.depart+" à "+ this.demande.arrive+" d'un prix de "+this.demande.prix+" Fcfa, a été validé par "+this.profil.nom+" de numéro de téléphone "+this.profil.tel;
  this.itemDoc.update({visible:false,
    idConducteur:this.profil.id
  });
  this.notifie.creatednotification(this.profil.id,objet,message);
  this.notifie.creatednotification(this.demande.idClient,objet,message);
  if(this.commande){
  //  alert("Ce bon provient d'une commande");
    this.validationCommande();
  }
  this.notifie.transferezcredit(this.demande.idClient,this.profil.id,this.demande.prix*0.9);
  this.notifie.transferezcredit(this.demande.idClient,"dvYaMXTYvKC4nXtMjUVG",this.demande.prix*0.1);
}
callere(e){
    console.log(e);
let tt=this.conducteur.tel;
    this.callNumber.callNumber(tt.toString(), true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => {
      this.presentToast("Impossible de passer un coup de fil")

    console.log('Error launching dialer', err)});
}

caller(e){
    console.log(e);
    let ft=this.client.tel;
    this.callNumber.callNumber(ft.toString(), true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => {
      this.presentToast("Impossible de passer un coup de fil")

    console.log('Error launching dialer', err)});
}
savel(){
  this.router.navigate(['/complaints', { id: this.name }]);
}
  validationCommande() {
  //alert("Pour ne pas oublier");
  this.afs.collection('Commande').doc(this.demande.idCommande).update({status:true});

  let message="La demande a été validé, votre Commande va bientot vous être livrés.Veuillez Consulter votre espace d'Opération pour plus d'information";
  this.afs.collection('Commande').doc(this.demande.idCommande).valueChanges().subscribe((data :any) => {
    let objet="Validation de la Commande "+ data.nom;
    this.notifie.creatednotification(data.idClient,objet,message);
    this.afs.collection(data.type).doc(data.produit).valueChanges().subscribe((dat :any)=> {
      let objet1="Commande  de "+ data.nom;

  let message1="Une Commande a été validé, veuillez preparer la commande..Veuillez Consulter votre espace d'Opération pour plus d'information";
  this.notifie.creatednotification(dat.created,objet1,message1);
  this.notifie.transferezcredit(data.idClient,dat.created,data.prix*0.85);
  this.notifie.transferezcredit(data.idClient,"dvYaMXTYvKC4nXtMjUVG",this.demande.prix*0.15);
    })
  })
  }

}
