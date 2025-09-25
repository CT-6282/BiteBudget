import React, { useState, useRef } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  PhotoCamera,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  Language as LanguageIcon,
  AttachMoney,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

const Profile: React.FC = () => {
  const { language, setLanguage, currency, setCurrency, t, formatCurrency } = useLanguage();
  const { user, logout } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || 1,
    name: user?.username || 'John Doe',
    email: user?.email || 'john@example.com',
    avatar: '',
    phone: '+52 555 123 4567',
    address: 'Ciudad de México, México',
    dateOfBirth: '1990-01-01',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile({ ...editedProfile, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    // Here you would typically make an API call to change the password
    setSuccessMessage('Password changed successfully!');
    setShowPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {t('profile')}
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Profile Information */}
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Profile Information
                </Typography>
                <Button
                  startIcon={isEditing ? <Save /> : <Edit />}
                  onClick={isEditing ? handleSave : handleEditToggle}
                  variant={isEditing ? 'contained' : 'outlined'}
                >
                  {isEditing ? t('save') : t('edit')}
                </Button>
              </Box>

              {/* Avatar Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={editedProfile.avatar || profile.avatar}
                  sx={{ width: 120, height: 120, mb: 2 }}
                >
                  {profile.name.charAt(0).toUpperCase()}
                </Avatar>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <Button
                      startIcon={<PhotoCamera />}
                      onClick={() => fileInputRef.current?.click()}
                      variant="outlined"
                      size="small"
                    >
                      Change Photo
                    </Button>
                  </>
                )}
              </Box>

              {/* Profile Fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Full Name"
                  value={isEditing ? editedProfile.name : profile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  disabled={!isEditing}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={isEditing ? editedProfile.email : profile.email}
                  onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  disabled={!isEditing}
                  fullWidth
                  type="email"
                />
                <TextField
                  label="Phone"
                  value={isEditing ? editedProfile.phone : profile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  disabled={!isEditing}
                  fullWidth
                />
                <TextField
                  label="Address"
                  value={isEditing ? editedProfile.address : profile.address}
                  onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                  disabled={!isEditing}
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label="Date of Birth"
                  value={isEditing ? editedProfile.dateOfBirth : profile.dateOfBirth}
                  onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {isEditing && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<Cancel />}
                    onClick={handleEditToggle}
                    variant="outlined"
                    color="secondary"
                  >
                    {t('cancel')}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Settings and Preferences */}
        <Box sx={{ flex: '1 1 300px' }}>
          {/* Language and Currency Settings */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Language & Currency
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value as any)}
                    startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="en">🇺🇸 English (US)</MenuItem>
                    <MenuItem value="es-MX">🇲🇽 Español (México)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={currency}
                    label="Currency"
                    onChange={(e) => setCurrency(e.target.value as any)}
                    startAdornment={<AttachMoney sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="USD">$ USD - US Dollar</MenuItem>
                    <MenuItem value="MXN">$ MXN - Mexican Peso</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Example: {formatCurrency(1234.56)}
              </Typography>
            </CardContent>
          </Card>

          {/* Test Data Management */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('Test Data Management')}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('Enable test data to explore features without manual entry')}
              </Typography>
              
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => window.open('/test-data-manager', '_blank')}
              >
                {t('Manage Test Data')}
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Security
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowPasswordDialog(true)}
                  fullWidth
                >
                  Change Password
                </Button>
                
                <Divider sx={{ my: 1 }} />
                
                <Button
                  variant="outlined"
                  color="error"
                  onClick={logout}
                  fullWidth
                >
                  {t('logout')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('current')}
                      edge="end"
                    >
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('new')}
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
