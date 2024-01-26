import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import "./main.css";

const Main = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState([]);
  const [animate, setAnimate] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const fadeIn = useSpring({
    opacity: animate ? 1 : 0,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const slideIn = useSpring({
    transform: animate ? "translateX(0%)" : "translateX(100%)",
    from: { transform: "translateX(100%)" },
    config: { duration: 500 },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setSelectedFile(file);
        if (!animate) {
          setAnimate(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItalicClick = () => {
    document.execCommand("italic", false, null);
  };

  const handleBoldClick = () => {
    document.execCommand("bold", false, null);
  };

  const handleNormalClick = () => {
    document.execCommand("italic", false, null);
    document.execCommand("bold", false, null);
  };

  const handleContentChange = (e) => {
    const content = e.target.innerText.trim();
    setCaption(content);
  };

  const getSelectedTextWithFormatting = () => {
    const selection = window.getSelection();
    let selectedText = selection.toString();

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const clonedSelection = range.cloneContents();
      const span = document.createElement("span");
      span.appendChild(clonedSelection);
      selectedText = span.innerHTML;
    }

    return selectedText;
  };

  const copyToClipboard = () => {
    const selectedText = getSelectedTextWithFormatting();
    const formattedMessage = `${selectedText}${caption.slice(selectedText.length)}`;
  
    // Replace HTML-style bold tags with WhatsApp-style bold tags
    const whatsappBoldMessage = formattedMessage.replace(/<b>\s*(.*?)\s*<\/b>/g, ' *$1* ');
  
    // Replace HTML-style italic tags with WhatsApp-style italic tags
    const whatsappItalicMessage = whatsappBoldMessage.replace(/<i>\s*(.*?)\s*<\/i>/g, ' _$1_ ');
  
    // Copy the formatted message to the clipboard
    navigator.clipboard.writeText(whatsappItalicMessage)
      .then(() => console.log("Message copied to clipboard"))
      .catch((err) => console.error("Error copying to clipboard", err));
  };
  
  
  

  const copyToTelegramClipboard = () => {
    const selectedText = getSelectedTextWithFormatting();
    const formattedMessage = `${selectedText}${caption.slice(selectedText.length)}`;

    const telegramBoldMessage = formattedMessage.replace(/<b>(.*?)<\/b>/g, ' **$1** ');
    const telegramItalicMessage = telegramBoldMessage.replace(/<i>(.*?)<\/i>/g, ' __$1__ ');

    navigator.clipboard.writeText(telegramItalicMessage)
      .then(() => console.log("Message copied to clipboard"))
      .catch((err) => console.error("Error copying to clipboard", err));
  };

  const uploadimg = () => {
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Image uploaded successfully", data);
        setImageSrc("");
      })
      .catch((err) => {
        console.log("Error uploading image", err);
      });
  };

  const sendCaption = () => {
    if (!caption) {
      console.log("No caption to send");
      return;
    }

    const selectedText = getSelectedTextWithFormatting();
    const finalMessage = `${selectedText}${caption.slice(selectedText.length)}`;

    fetch('/api/caption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ caption: finalMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Caption sent successfully", data);
        setCaption("");

        navigator.clipboard.writeText(finalMessage)
          .then(() => console.log("Message copied to clipboard"))
          .catch((err) => console.error("Error copying to clipboard", err));
      })
      .catch((err) => {
        console.log("Error sending caption", err);
      });
  };

  return (
    <>
      <div className="main-page">
        <animated.div
          id="contentEditable"
          contentEditable
          onInput={handleContentChange}
          onBlur={handleContentChange}
          style={{
            ...fadeIn,
            ...slideIn,
            padding: "10px",
            minHeight: "100px",
            overflowY: "auto",
            marginBottom: "10px",
          }}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Uploaded"
              style={{
                maxWidth: "100%",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            />
          )}
        </animated.div>

        <div className="btns">
          <label className="btn-edt" id="up-img">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
          <button className="btn-edt" onClick={handleItalicClick}>
            Italic
          </button>
          <button className="btn-edt" onClick={handleBoldClick}>
            Bold
          </button>
          <button className="btn-edt" onClick={handleNormalClick}>
            Normal
          </button>
          <button className="btn-edt" id='cpwhat' onClick={copyToClipboard}>
            Copy to Whatsapp 
          </button>
          <button className="btn-edt" id='cptele' onClick={copyToTelegramClipboard}>
            Copy to Telegram 
          </button>
        </div>

        {posts.map((post, index) => (
          <animated.div key={index} className="post" style={fadeIn}>
            {post.imageSrc && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={post.imageSrc}
                  alt="Posted"
                  style={{
                    maxWidth: "100%",
                    marginBottom: "10px",
                    borderRadius: "8px",
                  }}
                />
                <p>{post.caption}</p>
              </div>
            )}
          </animated.div>
        ))}
      </div>

      <button id='btn-last' onClick={() => { uploadimg(); sendCaption(); }} >SEND</button>
    </>
  );
};

export default Main;
