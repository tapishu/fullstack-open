import { Text, View } from 'react-native';

import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import{ SignInContainer} from "./SignIn"
import { act } from 'react'; // 👈 ここを追加
describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls onSubmit function with correct arguments when a valid form is submitted', async () => {
      // render the SignInContainer component, fill the text inputs and press the submit button
const onSubmit = jest.fn();
const { getByTestId } = await render(<SignInContainer onSubmit={onSubmit} />);

await act(async () => {
        fireEvent.changeText(getByTestId('usernameField'), 'kalle123');
      });

      await act(async () => {
        fireEvent.changeText(getByTestId('passwordField'), 'password123');
      });

      await act(async () => {
        fireEvent.press(getByTestId('submitButton'));
      });


      await waitFor(() => {
expect(onSubmit).toHaveBeenCalledTimes(1);

        // 最初の引数がフォームのオブジェクト（username, password）になっているか確認
        expect(onSubmit.mock.calls[0][0]).toEqual({
          username: 'kalle123',
          password: 'password123',
        });
      
      });
    });
  });
});