import { Button, TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { createHeaders } from "../api";
import { getTextList } from "../api/channel";
import { SET_TEXTLIST } from "../redux/TextList";

function ChattingArea({ stomp }) {
  const channelSeq = useSelector((state) => state.ChannelList.channelSeq);
  const token = useSelector((state) => state.UserInfo.accessToken);
  const textList = useSelector((state) => state.TextList.textList);
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    getTextList(
      channelSeq,
      token,
      (response) => {
        console.log("response : ", response.data.textStorageList);
        dispatch(SET_TEXTLIST(response.data.textStorageList));
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const onTextChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.shiftKey) {
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      let chatMessage = {
        receiver: channelSeq,
        channelSeq: channelSeq,
        textContent: inputText,
        status: "ADD_TEXT",
      };
      stomp.send(
        "/app/private-message",
        createHeaders(token),
        JSON.stringify(chatMessage)
      );
      setInputText("");
    }
  };

  return (
    <div className="chattingarea">
      <div>
        {textList.map((text) => (
          <div>
            <span>
              {text.at(2)}{" "}
              <button
                onClick={() => {
                  let chatMessage = {
                    receiver: channelSeq,
                    channelSeq: channelSeq,
                    textSeq: text.at(0),
                    status: "DEL_TEXT",
                  };
                  stomp.send(
                    "/app/private-message",
                    createHeaders(token),
                    JSON.stringify(chatMessage)
                  );
                }}
              >
                삭제
              </button>
            </span>
            <pre>{text.at(1)}</pre>
          </div>
        ))}
      </div>
      <div>
        <TextareaAutosize
          placeholder={"메시지 입력"}
          style={{
            width: "90%",
            lineHeight: "25px",
            resize: "none",
          }}
          maxRows="15"
          value={inputText}
          onChange={onTextChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export default ChattingArea;
