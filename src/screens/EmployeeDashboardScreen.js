import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import { updatePersonnel, getPersonnelById } from '../services/firebaseService';

export default function EmployeeDashboardScreen({ route, navigation }) {
  const { employee: initialEmployee } = route.params;
  const [employee, setEmployee] = useState(initialEmployee);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState(employee.name || '');
  const [surname, setSurname] = useState(employee.surname || '');
  const [role, setRole] = useState(employee.role || '');
  const [services, setServices] = useState((employee.services || []).join(', '));
  const [workingHours, setWorkingHours] = useState(employee.workingHours || '');
  const [dayOff, setDayOff] = useState(employee.dayOff || '');
  const [about, setAbout] = useState(employee.about || '');

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await getPersonnelById(employee.id);
      if (data) {
        setEmployee(data);
        setName(data.name || '');
        setSurname(data.surname || '');
        setRole(data.role || '');
        setServices((data.services || []).join(', '));
        setWorkingHours(data.workingHours || '');
        setDayOff(data.dayOff || '');
        setAbout(data.about || '');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !surname.trim()) {
      Alert.alert('Uyarı', 'İsim ve soyisim zorunludur.');
      return;
    }

    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        surname: surname.trim(),
        role: role.trim(),
        services: services.split(',').map((s) => s.trim()).filter(Boolean),
        workingHours: workingHours.trim(),
        dayOff: dayOff.trim(),
        about: about.trim(),
      };
      await updatePersonnel(employee.id, data);
      setEmployee((prev) => ({ ...prev, ...data }));
      setEditing(false);
      Alert.alert('Başarılı', 'Profiliniz güncellendi.');
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Güncellenirken bir sorun oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(employee.name || '');
    setSurname(employee.surname || '');
    setRole(employee.role || '');
    setServices((employee.services || []).join(', '));
    setWorkingHours(employee.workingHours || '');
    setDayOff(employee.dayOff || '');
    setAbout(employee.about || '');
    setEditing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1E293B', '#334155']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.replace('Entry')}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Profil Paneli</Text>
          <Text style={styles.headerSubtitle}>Personel Hesabı</Text>
        </View>
        <View style={styles.empBadge}>
          <Ionicons name="person" size={14} color="#FFF" />
          <Text style={styles.empBadgeText}>Personel</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {employee.image ? (
              <Image source={{ uri: employee.image }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={COLORS.textMuted} />
              </View>
            )}
          </View>
          <Text style={styles.profileName}>{employee.name} {employee.surname}</Text>
          <Text style={styles.profileRole}>{employee.role}</Text>
          {employee.phone ? (
            <Text style={styles.profilePhone}>{employee.phone}</Text>
          ) : null}
        </View>

        {/* Info / Edit Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {editing ? 'Profili Düzenle' : 'Profil Bilgileri'}
          </Text>
          {!editing && (
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
              <Ionicons name="create-outline" size={18} color="#FFF" />
              <Text style={styles.editBtnText}>Düzenle</Text>
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>İsim</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.fieldLabel}>Soyisim</Text>
            <TextInput style={styles.input} value={surname} onChangeText={setSurname} />

            <Text style={styles.fieldLabel}>Rol / Ünvan</Text>
            <TextInput style={styles.input} value={role} onChangeText={setRole} />

            <Text style={styles.fieldLabel}>Hizmetler (virgülle ayırın)</Text>
            <TextInput style={styles.input} value={services} onChangeText={setServices} multiline />

            <Text style={styles.fieldLabel}>Çalışma Saatleri</Text>
            <TextInput style={styles.input} value={workingHours} onChangeText={setWorkingHours} placeholder="10:00 - 22:00" />

            <Text style={styles.fieldLabel}>İzin Günü</Text>
            <TextInput style={styles.input} value={dayOff} onChangeText={setDayOff} placeholder="Pazartesi" />

            <Text style={styles.fieldLabel}>Hakkında</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              value={about}
              onChangeText={setAbout}
              multiline
            />

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <InfoRow label="İsim" value={`${employee.name} ${employee.surname}`} />
            <InfoRow label="Rol" value={employee.role} />
            <InfoRow label="Hizmetler" value={(employee.services || []).join(', ') || 'Belirtilmemiş'} />
            <InfoRow label="Çalışma Saatleri" value={employee.workingHours || 'Belirtilmemiş'} />
            <InfoRow label="İzin Günü" value={employee.dayOff || 'Belirtilmemiş'} />
            <InfoRow label="Hakkında" value={employee.about || 'Belirtilmemiş'} last />
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Entry')}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutBtnText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  empBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  empBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  // Profile Card
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: SIZES.radiusLarge,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  profileRole: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  profilePhone: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  // Info Display
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: SIZES.radiusMedium,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 20,
  },
  infoRow: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  // Form
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: SIZES.radiusMedium,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.primary,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: SIZES.radiusMedium,
    gap: 8,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.error,
  },
});
