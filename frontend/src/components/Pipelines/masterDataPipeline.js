import db from '../../firebase/config';
import { getDatabase, ref, onValue} from "firebase/database";

const neighborhoodRef = db.collection('cities');
const snapshot = await citiesRef.where().get();
if (snapshot.empty) {
  console.log('No matching documents.');
  return;
}  