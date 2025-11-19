export type SnackbarAction = {
  label: string;           // 버튼에 보여줄 텍스트 (예: "로그인", "다시 시도")
  onPress: () => void;     // 눌렀을 때 행동
};

export type SnackBarProps = {
  visible: boolean;
  message: string;
  bottom?: number;
  action?: SnackbarAction; // 🔹 있으면 버튼 보여주고, 없으면 안 보임
};