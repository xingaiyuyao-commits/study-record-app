import { render, screen, fireEvent, waitFor } from 
"@testing-library/react";
import App from "./App";

test("タイトルが表示されている", async () => {
  render(<App />);
  expect(await screen.findByText("学習記録だよ", {}, { timeout: 3000 })).toBeInTheDocument();
});

test("フォームに入力して登録すると記録が1つ増える", async () => {
  render(<App />);
  await screen.findByText("学習記録だよ");

  const before = screen.queryAllByRole("listitem").length;

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "テスト学習" },
  });
  fireEvent.change(screen.getByRole("spinbutton"), {
    target: { value: "2" },
  });
  fireEvent.click(screen.getByText("登録"));

  await waitFor(() => {
  expect(screen.getAllByRole("listitem").length).toBe(before + 1);
}, { timeout: 3000 });
});

test("削除ボタンを押すと記録が1つ減る", async () => {
  render(<App />);
  await screen.findByText("学習記録だよ");

  const beforeAdd = screen.queryAllByRole("listitem").length;

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "削除テスト用" },
  });
  fireEvent.change(screen.getByRole("spinbutton"), {
    target: { value: "1" },
  });
  fireEvent.click(screen.getByText("登録"));

  await waitFor(() => {
    expect(screen.getAllByRole("listitem").length).toBe(beforeAdd + 1);
  }, { timeout: 3000 });

  const before = screen.queryAllByRole("listitem").length;

  const deleteButtons = screen.getAllByText("削除");
  fireEvent.click(deleteButtons[deleteButtons.length - 1]);

  await waitFor(() => {
    expect(screen.getAllByRole("listitem").length).toBe(before - 1);
  }, { timeout: 3000 });
});

test("入力をしないで登録を押すとエラーが表示される", async () => {
  render(<App />);
  await screen.findByText("学習記録だよ");

  fireEvent.click(screen.getByText("登録"));

  expect(
    await screen.findByText("学習内容と学習時間を正しく入力してください")
  ).toBeInTheDocument();
});