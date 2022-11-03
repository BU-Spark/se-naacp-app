import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase, ref } from "firebase/database";
import { collection, query, where, getDocs } from "firebase/firestore";
// import db from '../components/firebase/config';

// const firebaseConfig = {
//     apiKey: "AIzaSyBs56-JElWsyrecEnTIDRntockDmXRl3zE",
//     authDomain: "se-naacp-journalism-bias.firebaseapp.com",
//     databaseURL: "https://se-naacp-journalism-bias-default-rtdb.firebaseio.com",
//     projectId: "se-naacp-journalism-bias",
//     storageBucket: "se-naacp-journalism-bias.appspot.com",
//     messagingSenderId: "163164284037",
//     appId: "1:163164284037:web:6e6b48b67efd93746fb5ec"
//   };
const firebaseConfig = {
  apiKey: "AIzaSyB2F5d8jyeNEnwcKAVAqnYAYArJg43tyuQ",
  authDomain: "test-naacp.firebaseapp.com",
  databaseURL: "https://test-naacp-default-rtdb.firebaseio.com",
  projectId: "test-naacp",
  storageBucket: "test-naacp.appspot.com",
  messagingSenderId: "152016517221",
  appId: "1:152016517221:web:9f33a25ec079e4b5846e8c"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore()

const s_date = "0317015";
const e_date = "09182016";
const n_name = "allston";
const sn_name = "aberdeen";

let n_articles = [];
let sn_articles = [];

// params: s_date, e_date, n_name, sn_name

// query for demographic
let demographic_dic = {'B': 111583, 'A': 60012, 'W': 260296, 'N': 4189};
console.log(demographic_dic);

// this query u can use for searching demographic for certain neighborhood: pass in n_name
// db.collection("neighborhoods_meta").where("name", "==", n_name)
//     .get()
//     .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             // doc.data() is never undefined for query doc snapshots
//             demographic_dic['A'] += doc.data()['demographic_data']['asian'];
//             demographic_dic['B'] += doc.data()['demographic_data']['black'];
//             demographic_dic['W'] += doc.data()['demographic_data']['white'];
//             demographic_dic['N'] += doc.data()['demographic_data']['american_indian_alaskan_native'];
//             // demographic_dic['B'] += doc.data()['demographic_data']['black'];
//             // demographic_dic['A'] += doc.data()['demographic_data']['asian'];
//             // demographic_dic['W'] += doc.data()['demographic_data']['white'];
//         });
//         console.log(demographic_dic);
//     })
//     .catch((error) => {
//         console.log("Error getting documents: ", error);
//     });


// // query for article
// async function filterDate() {
//   // let id_query = query(collection(db, "filter_date"), where("date", ">=", s_date), where("date", "<=", e_date));
//   // let aids = await getDocs(id_query);
//   // console.log(aids);
//   let aids = []
//   db.collection("filter_date")
//       .get()
//       .then((querySnapshot) => {
//           querySnapshot.forEach((doc) => {
//               // doc.data() is never undefined for query doc snapshots
//               if (s_date <= doc.id <= e_date){
//                 aids += doc.data()['article_keys'];
//               }
//           });
//           localStorage.setItem("aid", aids);
//           // console.log(localStorage.getItem("aid"));
//       })
//       .catch((error) => {
//           console.log("Error getting documents: ", error);
//       });
// }

// async function filterNH() {
//   // let id_query = query(collection(db, "filter_date"), where("date", ">=", s_date), where("date", "<=", e_date));
//   // let aids = await getDocs(id_query);
//   // console.log(aids);
//   await filterDate();
//   db.collection("filter_neighborhood")
//   .get()
//   .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//           // doc.data() is never undefined for query doc snapshots
//           if (n_name == doc.id){
//             console.log(doc.data()['article_keys']);
//             n_articles += doc.data()['article_keys'];
//           }
//           localStorage.setItem("n_aids", n_articles);
//       });
//       // console.log(n_articles);
//   })
//   .catch((error) => {
//       console.log("Error getting documents: ", error);
//   });
// }

// async function filterSNH() {
//   // let id_query = query(collection(db, "filter_date"), where("date", ">=", s_date), where("date", "<=", e_date));
//   // let aids = await getDocs(id_query);
//   // console.log(aids);
//   // function that gets the 
//   await filterNH();
//   db.collection("filter_subneighborhood")
//   .get()
//   .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//           // doc.data() is never undefined for query doc snapshots
//           if (sn_name == doc.id){
//             sn_articles += doc.data()['article_keys'];
//           }
//           localStorage.setItem("sn_aids", sn_articles);
//           // console.log(sn_articles);
//       });
//   })
//   .catch((error) => {
//       console.log("Error getting documents: ", error);
//   });
// }

// filterSNH();



// const n_query = query(ref(db, "filter_neighborhood"), where("name", "==", n_name));
// const n_articles = await getDocs(n_query);
// const sn_query = query(ref(db, "subneighborhood_meta"), where("name", "==", sn_name));
// const sn_articles = await getDocs(sn_query);

// const art_ids = aids.filter(value => n_articles.includes(value) && sn_articles(value));
// // get a the list of articles and the data
// const q = query(ref(db, "articles"), where("id", "in", art_ids));
// const articles = await getDocs(q);
// // log articles
// articles.forEach((article) => {
//     console.log(article.title);
// });


// let aids = [];

// db.collection("filter_date")
//     .get()
//     .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             // doc.data() is never undefined for query doc snapshots
//             if (s_date <= doc.id <= e_date){
//               aids += doc.data()['article_keys'];
//             }
//         });
//         console.log("article ids: ", aids);
//     })
//     .catch((error) => {
//         console.log("Error getting documents: ", error);
//     });



// get neighborhoods count data
// const neighborhoods_dict = {}
// articles.forEach((article) => {
//     // doc.data() is never undefined for query doc snapshots
//     if (article.neighborhood in neighborhoods_dict){
//         neighborhoods_dict[article.neighborhood] = 0;
//     }
//     else{
//         neighborhoods_dict[article.neighborhood] += 1;
//     }
// });
// console.log(neighborhoods_dict)


//query for topics

export default db;