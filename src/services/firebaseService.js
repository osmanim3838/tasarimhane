import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==================== SALON ====================

export async function getSalon(salonId) {
  const docRef = doc(db, 'salons', salonId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

// ==================== PERSONNEL ====================

export async function getPersonnel(salonId) {
  const q = query(
    collection(db, 'personnel'),
    where('salonId', '==', salonId),
    orderBy('name', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getPersonnelById(personnelId) {
  const docRef = doc(db, 'personnel', personnelId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

// ==================== USERS ====================

export async function createOrGetUser(phone, firstName, lastName) {
  const q = query(
    collection(db, 'users'),
    where('phone', '==', phone)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const existing = snapshot.docs[0];
    return { id: existing.id, ...existing.data() };
  }

  const userRef = await addDoc(collection(db, 'users'), {
    firstName,
    lastName,
    phone,
    createdAt: serverTimestamp(),
  });

  return {
    id: userRef.id,
    firstName,
    lastName,
    phone,
  };
}

export async function getUserByPhone(phone) {
  const q = query(
    collection(db, 'users'),
    where('phone', '==', phone)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
}

// ==================== ADMIN: OWNER / EMPLOYEE LOGIN ====================

export async function loginWithPhone(phone) {
  // Check if owner
  const salonQ = query(
    collection(db, 'salons'),
    where('ownerPhone', '==', phone)
  );
  const salonSnap = await getDocs(salonQ);
  if (!salonSnap.empty) {
    const salon = salonSnap.docs[0];
    return { role: 'owner', data: { id: salon.id, ...salon.data() } };
  }

  // Check if employee
  const empQ = query(
    collection(db, 'personnel'),
    where('phone', '==', phone)
  );
  const empSnap = await getDocs(empQ);
  if (!empSnap.empty) {
    const emp = empSnap.docs[0];
    return { role: 'employee', data: { id: emp.id, ...emp.data() } };
  }

  return null;
}

// ==================== ADMIN: SALON UPDATE ====================

export async function updateSalon(salonId, data) {
  const salonRef = doc(db, 'salons', salonId);
  await updateDoc(salonRef, { ...data, updatedAt: serverTimestamp() });
}

// ==================== ADMIN: PERSONNEL MANAGEMENT ====================

export async function updatePersonnel(personnelId, data) {
  const ref = doc(db, 'personnel', personnelId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function addPersonnel(data) {
  const ref = await addDoc(collection(db, 'personnel'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deletePersonnel(personnelId) {
  await deleteDoc(doc(db, 'personnel', personnelId));
}

// ==================== ADMIN: APPOINTMENT MANAGEMENT ====================

export async function updateAppointmentStatus(appointmentId, status) {
  const ref = doc(db, 'appointments', appointmentId);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
}

// ==================== APPOINTMENTS ====================

export async function createAppointment(data) {
  const ref = await addDoc(collection(db, 'appointments'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserAppointments(userId) {
  const q = query(
    collection(db, 'appointments'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getSalonAppointments(salonId) {
  const q = query(
    collection(db, 'appointments'),
    where('salonId', '==', salonId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ==================== SEED DATA ====================

export async function seedDatabase() {
  // Check if salon already exists
  const salonRef = doc(db, 'salons', 'tasarimhane');
  const salonSnap = await getDoc(salonRef);

  if (salonSnap.exists()) {
    console.log('Database already seeded');
    return;
  }

  // Seed salon
  await setDoc(salonRef, {
    name: 'TASARIMHANE',
    type: 'Bay/Bayan Güzellik Salonu',
    owner: 'Mesut AKÇAKOCA',
    ownerPhone: '+905551234567',
    foundedYear: '2014',
    staffCount: '4 Kişi',
    phone: '+90 555 123 4567',
    whatsapp: '+90 555 123 4567',
    address: 'Atatürk Caddesi No: 25, Merkez/Düzce',
    about: 'TASARIMHANE olarak 2014 yılından bu yana müşterilerimize en kaliteli hizmeti sunmak için çalışıyoruz. Müşteri memnuniyetini ön planda tutarak, sektördeki yenilikleri ve değişikliklere kusursuz bir şekilde uyum sağlayarak, bu yolda emin adımlarla ilerlemeye devam ediyoruz. Başarıya profesyonel bir ekiple ulaşmanın önemini biliyor ve her gün daha iyisini hedefliyoruz.',
    workingHours: [
      { day: 'Pazartesi', hours: '10:00 - 22:00', isOpen: true },
      { day: 'Salı', hours: '10:00 - 22:00', isOpen: true },
      { day: 'Çarşamba', hours: '10:00 - 22:00', isOpen: true },
      { day: 'Perşembe', hours: '10:00 - 22:00', isOpen: true },
      { day: 'Cuma', hours: '10:00 - 22:00', isOpen: true },
      { day: 'Cumartesi', hours: '10:00 - 22:00', isOpen: true },
      { day: 'Pazar', hours: '10:00 - 22:00', isOpen: true },
    ],
    socialMedia: {
      facebook: 'https://facebook.com/tasarimhane',
      instagram: 'https://instagram.com/tasarimhane',
      twitter: 'https://twitter.com/tasarimhane',
      tiktok: 'https://tiktok.com/@tasarimhane',
    },
    images: [
      'https://picsum.photos/seed/salon1/800/400',
      'https://picsum.photos/seed/salon2/800/400',
      'https://picsum.photos/seed/salon3/800/400',
      'https://picsum.photos/seed/salon4/800/400',
      'https://picsum.photos/seed/salon5/800/400',
      'https://picsum.photos/seed/salon6/800/400',
    ],
    createdAt: serverTimestamp(),
  });

  // Seed personnel
  const personnelData = [
    {
      name: 'Fatma Gül',
      surname: 'Özkaya',
      phone: '+905551000001',
      role: 'Kadın/Erkek Kuaförü',
      image: 'https://picsum.photos/seed/fatma/200/200',
      services: ['Saç Bakımı', 'Saç Yıkama+Fön', 'Saç Düzleştirme', 'Saç Boyama', 'Ağda(Tüm Vücut)', 'Cilt Bakımı'],
      about: 'Merhaba,\nBen Fatma Gül . TASARIMHANE salonunda yukarıda listelenen hizmetleri veriyorum. Çarşamba günleri hariç haftanın 6 günü 12:00-21:00 saatleri arasında seni de salonumuza bekliyoruz.',
      workingHours: '12:00 - 21:00',
      dayOff: 'Çarşamba',
      salonId: 'tasarimhane',
    },
    {
      name: 'İbrahim',
      surname: 'AKÇAKOCA',
      phone: '+905551000002',
      role: 'Kadın/Erkek Kuaförü',
      image: 'https://picsum.photos/seed/ibrahim/200/200',
      services: ['Saç Kesimi', 'Sakal Tıraşı', 'Saç Boyama', 'Saç Şekillendirme'],
      about: 'Merhaba,\nBen İbrahim. TASARIMHANE salonunda yukarıda listelenen hizmetleri veriyorum.',
      workingHours: '10:00 - 22:00',
      dayOff: 'Pazartesi',
      salonId: 'tasarimhane',
    },
    {
      name: 'İsmet',
      surname: 'Yiğit',
      phone: '+905551000003',
      role: 'Kadın/Erkek Kuaförü',
      image: 'https://picsum.photos/seed/ismet/200/200',
      services: ['Saç Kesimi', 'Saç Boyama', 'Saç Bakımı'],
      about: 'Merhaba,\nBen İsmet. TASARIMHANE salonunda yukarıda listelenen hizmetleri veriyorum.',
      workingHours: '10:00 - 22:00',
      dayOff: 'Salı',
      salonId: 'tasarimhane',
    },
    {
      name: 'Mesut',
      surname: 'AKÇAKOCA',
      phone: '+905551234567',
      role: 'Kadın/Erkek Kuaförü',
      image: 'https://picsum.photos/seed/mesut/200/200',
      services: ['Saç Kesimi', 'Sakal Tıraşı', 'Saç Şekillendirme', 'Saç Boyama'],
      about: 'Merhaba,\nBen Mesut. TASARIMHANE salonunun sahibi ve kuaförüyüm.',
      workingHours: '10:00 - 22:00',
      dayOff: 'Pazar',
      salonId: 'tasarimhane',
    },
    {
      name: 'Osman Baki',
      surname: 'Akçakoca',
      phone: '+905551000005',
      role: 'Kadın/Erkek Kuaförü',
      image: 'https://picsum.photos/seed/osman/200/200',
      services: ['Saç Kesimi', 'Saç Boyama'],
      about: 'Merhaba,\nBen Osman Baki. TASARIMHANE salonunda hizmet veriyorum.',
      workingHours: '10:00 - 22:00',
      dayOff: 'Çarşamba',
      salonId: 'tasarimhane',
    },
    {
      name: 'Şevket',
      surname: 'Demirkaya',
      phone: '+905551000006',
      role: 'Kadın/Erkek Kuaförü',
      image: null,
      services: ['Saç Kesimi', 'Sakal Tıraşı'],
      about: 'Merhaba,\nBen Şevket. TASARIMHANE salonunda hizmet veriyorum.',
      workingHours: '10:00 - 22:00',
      dayOff: 'Perşembe',
      salonId: 'tasarimhane',
    },
    {
      name: 'TASARIMHANE',
      surname: '.',
      phone: '+905551000007',
      role: 'Kadın/Erkek Kuaförü',
      image: 'https://picsum.photos/seed/tasarimhane/200/200',
      services: ['Tüm Hizmetler'],
      about: 'TASARIMHANE salon hesabı.',
      workingHours: '10:00 - 22:00',
      dayOff: 'Yok',
      salonId: 'tasarimhane',
    },
  ];

  for (const person of personnelData) {
    await addDoc(collection(db, 'personnel'), person);
  }

  console.log('Database seeded successfully!');
}
