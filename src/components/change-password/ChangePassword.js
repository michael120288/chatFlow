import Button from '@components/button/Button';
import '@components/change-password/ChangePassword.scss';
import Input from '@components/input/Input';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { userService } from '@services/api/user/user.service';
import { Utils } from '@services/utils/utils.service';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentType, setCurrentType] = useState('password');
  const [newType, setNewType] = useState('password');
  const [confirmType, setConfirmType] = useState('password');
  const [togglePassword, setTogglePassword] = useState(false);
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteSessionPageReload] = useSessionStorage('pageReload', 'delete');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordDisplay = () => {
    const next = !togglePassword;
    setTogglePassword(next);
    const inputType = next ? 'text' : 'password';
    setCurrentType(inputType);
    setNewType(inputType);
    setConfirmType(inputType);
  };

  const changePassword = async (event) => {
    event.preventDefault();
    try {
      const response = await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (response) {
        Utils.dispatchNotification(response.data.message, 'success', dispatch);
        setTimeout(async () => {
          try {
            await userService.logoutUser();
          } catch {
            // ignore logout errors
          }
          Utils.clearStore({
            dispatch,
            deleteStorageUsername,
            deleteSessionPageReload,
            setLoggedIn
          });
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  return (
    <div className="password-change-container" data-testid="change-password">
      <form onSubmit={changePassword}>
        <div className="form-group">
          <Input
            id="currentPassword"
            name="currentPassword"
            type={currentType}
            value={currentPassword}
            labelText="Current Password"
            placeholder=""
            handleChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div className="form-group">
          <Input
            id="newPassword"
            name="newPassword"
            type={newType}
            value={newPassword}
            labelText="New Password"
            placeholder=""
            handleChange={(event) => setNewPassword(event.target.value)}
          />
        </div>
        <div className="form-group">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={confirmType}
            value={confirmPassword}
            labelText="Confirm Password"
            placeholder=""
            handleChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        <div className="form-group form-btn-group">
          <div className="btn-group">
            <Button label="Update" className="update" disabled={!currentPassword || !newPassword || !confirmPassword} />
            <span className="eye-icon" data-testid="eye-icon" onClick={togglePasswordDisplay}>
              {!togglePassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ChangePassword;
