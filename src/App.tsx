import { useState, useEffect } from "react"; // 1. useEffect を追加インポート
import { supabase } from "./supabaseClient";

export default function App() {
  const [studyTime, setStudyTime] = useState(0);
  const [studyContent, setStudyContent] = useState("");
  const [records, setRecords] = useState<
    { id: number; title: string; time: number }[]
  >([]);
  const [error, setError] = useState("");

  // ★ここを追加：ローディング状態を管理するState
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error: fetchError } = await supabase
        .from("test_records")
        .select("*");

      if (fetchError) {
        setError("データ取得エラー: " + fetchError.message);
        setIsLoading(false); // エラーの時もローディングは終わらせる
        return;
      }

      if (data) {
        setRecords(data);
      }

      // ★ここを追加：データ取得が成功したらローディングを終わらせる
      setIsLoading(false);
    };

    fetchRecords();
  }, []);

  // 登録処理（ここはそのまま）
  const handleAdd = async () => {
    if (!studyContent || studyTime <= 0) {
      setError("学習内容と学習時間を正しく入力してください");
      return;
    }

    const { data, error: supabaseError } = await supabase
      .from("test_records")
      .insert([{ title: studyContent, time: studyTime }])
      .select();

    if (supabaseError) {
      setError("データベース保存エラー: " + supabaseError.message);
      return;
    }

    if (data) {
      setError("");
      // 新しく作られたデータ（id入り）をリストに追加
      setRecords([...records, data[0]]);
      setStudyContent("");
      setStudyTime(0);
    }
  };

  // ★新規追加：削除処理の関数
  const handleDelete = async (id: number) => {
    // 1. Supabaseのデータベースから該当するidのデータを削除
    const { error: deleteError } = await supabase
      .from("test_records")
      .delete()
      .eq("id", id); // 「idが一致するものを消す」という指示

    if (deleteError) {
      setError("削除エラー: " + deleteError.message);
      return;
    }

    // 2. 画面のリストからも削除（今消したid以外のものを残す）
    setRecords(records.filter((record) => record.id !== id));
  };

  const totalStudyTime = records.reduce((sum, r) => sum + Number(r.time), 0);

  // ★ここを追加：ローディング中なら、この画面だけを表示して処理を止める
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>データを読み込んでいます...⏳</h2>
      </div>
    );
  }

  // ローディングが終わっていれば、いつもの画面が表示される

  return (
    <div className="App">
      <h1>学習記録だよ</h1>

      <div>
        <label>学習内容：</label>
        <input
          type="text"
          value={studyContent}
          onChange={(e) => setStudyContent(e.target.value)}
        />
      </div>

      <div>
        <label>学習時間：</label>
        <button
          type="button"
          onClick={() => setStudyTime((t) => Math.max(0, t - 1))}
        >
          −
        </button>
        <input
          type="number"
          value={studyTime}
          onChange={(e) => setStudyTime(parseFloat(e.target.value) || 0)}
          style={{ width: "60px", textAlign: "center" }}
        />
        <button type="button" onClick={() => setStudyTime((t) => t + 1)}>
          ＋
        </button>
      </div>

      <button onClick={handleAdd}>登録</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {/* 変更③：record.id を使ってリストを表示し、削除ボタンを追加 */}
        {records.map((record) => (
          <li key={record.id} style={{ marginBottom: "8px" }}>
            {record.title} : {record.time} 時間
            <button
              onClick={() => handleDelete(record.id)}
              style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      <p>合計学習時間: {totalStudyTime} / 1000 (h)</p>
    </div>
  );
}
