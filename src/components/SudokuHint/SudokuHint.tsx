import { Toast } from 'react-bootstrap';

export default function SudokuHint() {
  return (
    <Toast>
      <Toast.Header>
        <strong className="me-auto">Hint</strong>
        <small>11 mins ago</small>
      </Toast.Header>
      <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
    </Toast>
  );
}
