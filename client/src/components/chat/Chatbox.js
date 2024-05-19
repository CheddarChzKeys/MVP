import React, {useRef,useState, useCallback, useEffect} from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { css } from "@emotion/react";



const Chatbox = ({toggleImagePopUp, changePopUpImage,loading, changeLoading, socket}) => {

    const [chats, updateChats] = useState([]);
    const [loadedAll, changeLoadedAll] = useState(true);
    const [newChatsCount, changeNewChatsCount] = useState(0);
    
    const chatBoxRef = useRef();
    const observer = useRef();
    const lastLoadedChat = useRef(null);
    
    let updatedChats = [];
    const override = css`
    align-items: center;
    margin: auto auto;
  `;

    const firstChatRef = useCallback(
        (node) => {
          if (loading) {
            return;
          } else {
            if (observer.current) {
              observer.current.disconnect();
            }
            observer.current = new IntersectionObserver((entries) => {
              if (entries[0].isIntersecting && !loadedAll && chats.length > 0) {
                console.log("node is intersecting");
                changeLoading(true);
                changeLoadedAll(true);
                socket.emit("getMoreChats", chats[0]._id);
              }
            });
            if (node) {
              observer.current.observe(node);
            }
          }
        },
        [loading, loadedAll, chats]
    );

    const scrollToBottom = () => {
    const timeout1 = setTimeout(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, 500);
    };
    
    const scrollToLastLoadedChat = () => {
    const timeout1 = setTimeout(() => {
        lastLoadedChat.current.scrollIntoView({
        block: "center",
        inline: "nearest",
        });
    }, 1);
    };
    
    const imageClick = (image) => {
    changePopUpImage(image);
    toggleImagePopUp(true);
    };

    const convertedTimeStamp = (date) => {
        const timeStamp = getDateStamp(parseISOString(date));
        const timeStampArray = timeStamp.split(" ");
        timeStampArray[0] = timeStampArray[0].slice(0,timeStampArray[0].length - 1)
        const timeArray = timeStampArray[1].split(":");
        const time = timeArray[0] + ":" + timeArray[1];
        timeStampArray[1] = time;
        if (getDateStamp(new Date()).split(", ")[0] == timeStamp.split(", ")[0]) {
          return `Today, ${timeStampArray[1] + timeStampArray[2]}`;
        } else {
          return timeStampArray.join("  ");
        }
    };

    const getDateStamp = (today) => {
        return today.toLocaleString();
      };
    
      const parseISOString = (s) => {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      };

    useEffect(() => {
      console.log("NEW SHOES ON THE RIDE")
        socket.on("allChats", (data) => {
          console.log("ALLCHATS")
          const reversedChats = data.result.slice().reverse();
          updateChats(reversedChats);
          const loadedAllTimeout = setTimeout(() => {
            changeLoadedAll(data.loadedAll);
          }, 2000);
          scrollToBottom();
          changeLoading(false);
        });
      }, []);
    
      useEffect(() => {
        console.log("USEEFFECT CHATS")
        socket.on("addOlderChats", (data) => {
          console.log("OLDER CHATS")
          changeLoading(true);
          const reversedChats = data.result.slice().reverse();
          updatedChats = reversedChats.concat(chats);
          const loadedAllTimeout = setTimeout(() => {
            changeLoadedAll(data.loadedAll);
          }, 2000);
          changeNewChatsCount(data.result.length);
          updateChats(updatedChats);
          changeLoading(false);
          scrollToLastLoadedChat();
        });
      }, [chats]);

    return(
      <>
      {loading?
                      <MoonLoader
                      color="#79d9ff"
                      loading={loading}
                      css={override}
                      size="100px"
                    />:
        <div id="chatbox" ref={chatBoxRef}>
            {console.log("CHATBOX RENDER")}
            {!loadedAll && (
            <div
                ref={firstChatRef}
                className="galleryLoadMoreWrapper colorHover pointerHover"
            >
                <p className="galleryLoadMore">Load More</p>
            </div>
            )}
            {chats.map((chat, index) => {
            console.log("CHATS RERENDER")
            return (
                <div
                key={chat._id}
                ref={index === newChatsCount ? lastLoadedChat : null}
                id="chat"
                >
                <div className="nameDate">
                    <div className="chatAvatarWrapper">
                    <img
                        className="chatAvatarImage"
                        src={`https://mywarzoneappbucket.s3.us-west-1.amazonaws.com/${chat.png}_largeThumb.png`}
                    />
                    </div>
                    <div className="chatName">{chat.name}</div>
                    <div className="chatDate">
                    {convertedTimeStamp(chat.date)}
                    </div>
                </div>
                <div className="chatContent">
                    <div id="chatMessage">{chat.message}</div>
                    {chat.gif && (
                    <div className = "chatImageWrapper">
                        <img
                        className="chatItem"
                        id="chatGif"
                        src={chat.gif.downsized}
                        onClick={() => imageClick(chat.gif.original)}
                        ></img>
                    </div>
                    )}
                    {chat.video && (
                    <div className="ytOutterWrapper">
                        <div id="ytPlayerWrapper" className="chatItem">
                        <iframe
                            className="ytPlayer"
                            id="galleryYTPlayer"
                            type="text/html"
                            src={`http://www.youtube.com/embed/${chat.video}`}
                            frameBorder="0"
                            allowFullScreen="allowfullscreen"
                            mozallowfullscreen="mozallowfullscreen"
                            msallowfullscreen="msallowfullscreen"
                            oallowfullscreen="oallowfullscreen"
                            webkitallowfullscreen="webkitallowfullscreen"
                        ></iframe>
                        </div>
                    </div>
                    )}
                    {chat.image && (
                    <div className="chatImageWrapper">
                        {chat.image.map((image) => {
                        return (
                            <img
                            className="chatItem"
                            id="chatImg"
                            src={image}
                            onClick={() => imageClick(image)}
                            ></img>
                        );
                        })}
                    </div>
                    )}
                </div>
                </div>
            );
            })}
        </div>
      }
    </>
    )
}

export default Chatbox;