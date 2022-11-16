import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase, ref } from "firebase/database";
import { collection, query, where, getDocs } from "firebase/firestore";
// import db from '../components/firebase/config';

const firebaseConfig = {
    apiKey: "AIzaSyBs56-JElWsyrecEnTIDRntockDmXRl3zE",
    authDomain: "se-naacp-journalism-bias.firebaseapp.com",
    databaseURL: "https://se-naacp-journalism-bias-default-rtdb.firebaseio.com",
    projectId: "se-naacp-journalism-bias",
    storageBucket: "se-naacp-journalism-bias.appspot.com",
    messagingSenderId: "163164284037",
    appId: "1:163164284037:web:6e6b48b67efd93746fb5ec"
  };
// const firebaseConfig = {
//   apiKey: "AIzaSyB2F5d8jyeNEnwcKAVAqnYAYArJg43tyuQ",
//   authDomain: "test-naacp.firebaseapp.com",
//   databaseURL: "https://test-naacp-default-rtdb.firebaseio.com",
//   projectId: "test-naacp",
//   storageBucket: "test-naacp.appspot.com",
//   messagingSenderId: "152016517221",
//   appId: "1:152016517221:web:9f33a25ec079e4b5846e8c"
// };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export default db;

const s_date = "0317015";
const e_date = "09182016";
const n_name = "back_bay";
const sn_name = "aberdeen";

let n_articles = [];
let sn_articles = [];
let articleMeta = [];

// params: s_date, e_date, n_name, sn_name

// query for demographic
let demographic_dic = {'B': 111583, 'A': 60012, 'W': 260296, 'N': 4189};

async function getDemographic(){
  let demographic_dic = {'B': 0, 'A': 0, 'W': 0, 'N': 0};
  // this query u can use for searching demographic for certain neighborhood: pass in n_name
  db.collection("neighborhoods_meta").where("name", "==", n_name)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              demographic_dic['A'] += doc.data()['demographic_data']['asian'];
              demographic_dic['B'] += doc.data()['demographic_data']['black'];
              demographic_dic['W'] += doc.data()['demographic_data']['white'];
              demographic_dic['N'] += doc.data()['demographic_data']['american_indian_alaskan_native'];
          });
          localStorage.setItem("demographic_dic", demographic_dic);

      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
}



// query for article
async function filterDate() {
  let aids = []
  db.collection("filter_date")
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              if (s_date <= doc.data()['date'] <= e_date){
                aids += doc.data()['article_keys'];
              }
          });
          localStorage.setItem("aid", aids);
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
}

async function filterNH() {
  await filterDate();
  db.collection("filter_neighborhood").where("name", "==", n_name)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          n_articles += doc.data()['article_keys'];
      });
      localStorage.setItem("n_aids", n_articles);
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}

async function filterSNH() {
  await filterNH();
  db.collection("filter_subneighborhood")
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          if (sn_name == doc.data()['name']){
            sn_articles += doc.data()['article_keys'];
          }
      });
      localStorage.setItem("sn_aids", sn_articles);
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}

// get neighborhoods count data
function getNCount(articlesList) {
  const neighborhoods_dict = {}
  articlesList.forEach((article) => {
      if (article.neighborhood in neighborhoods_dict){
          neighborhoods_dict[article.neighborhood] = 0;
      }
      else{
          neighborhoods_dict[article.neighborhood] += 1;
      }
  });
  console.log("Neighborhood Count:" + neighborhoods_dict);
}

async function getArticleMeta() {
  await filterNH();
  console.log(localStorage.getItem("n_aids"));
  // const art_ids = aids.filter(value => localStorage["n_aids"].includes(value) && sn_articles(value));
  let artids = localStorage.getItem("n_aids").split(",");
  db.collection("articles_meta").where("content_id", "in", artids)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
            articleMeta += doc.data();
            console.log(JSON.stringify(doc.data()))
      });
      localStorage.setItem("articleMeta", articleMeta);
      console.log("Article Meta:", JSON.stringify(articleMeta));
      // getNCount(localStorage.getItem("articleMeta"));
      console.log("finish");
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}

// getArticleMeta();
