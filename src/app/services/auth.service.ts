import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, query, where, getDocs } from "firebase/firestore";
import * as fs from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private cutomerName: string | null = '';

  private userUID: string = '';

  private role_names: string[] = [];


  constructor(public afAuth: AngularFireAuth, private router: Router, public firestore: AngularFirestore) {

    this.subscribeToAuthChanges();

  }


  async subscribeToAuthChanges() {

    this.afAuth.authState.subscribe(user => {

      if (user) {

        this.cutomerName = user.displayName;

        this.userUID = user.uid;

        let query2 = this.firestore.collection('power_users').ref.where('user', '==', this.userUID);

        getDocs(query2).then(querySnapshot => {

          for (let doc of querySnapshot.docs) {

            let agentsData: any = doc.data();

            this.role_names.push(agentsData.role);

          }

        });

      }
      else {

        console.log('not logged in');

        this.cutomerName = '';

        this.userUID = '';

        this.router.navigateByUrl('login');

      }

    });


  }


  login(email: string, password: string) {

    return this.afAuth.signInWithEmailAndPassword(email, password);

  }

  logout() {

    this.afAuth.signOut().then(() => {

      this.router.navigateByUrl('login');

    });

  }


  getUserName() {

    return this.cutomerName;

  }

  getUserRoles() {

    return this.role_names;

  }


  getUserUID() {

    return this.userUID;
  }



}
