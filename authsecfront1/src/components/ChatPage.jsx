import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { styles } from "./ChatPageStyles";
import {
  FiSend,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiPhoneOff,
  FiUnlock,
  FiLock,
  FiAlertTriangle
} from "react-icons/fi";

const COLORS = {
  primary: '#00838f',
  secondary: '#00acc1',
  lightBlueGreen: '#4fb3bf',
  darkBlueGreen: '#007c91',
  veryLightBlue: '#5ddef4',
  coral: '#ff9e80',
  pastelGreen: '#a5d6a7',
  lightBlue: '#80deea',
  vividCyan: '#26c6da',
  veryLightBlue2: '#b2ebf2'
};

const DEFAULT_PROFILE_PICTURE = "https://via.placeholder.com/40";

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const receiverId = queryParams.get("receiverId");
  const rawRole = queryParams.get("role");
  const receiverRole = rawRole?.toUpperCase() === "USER" ? "STUDENT" : rawRole?.toUpperCase() || "STUDENT";

  // States
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [receiverImage, setReceiverImage] = useState(DEFAULT_PROFILE_PICTURE);
  const [conversations, setConversations] = useState([]);
  const [conversationImages, setConversationImages] = useState({});
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockedByMe, setBlockedByMe] = useState(false);
  const [blockedByThem, setBlockedByThem] = useState(false);

  const token = localStorage.getItem("accessToken");
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  // Format date functions
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  const formatDisplayDate = (date) => date?.toLocaleDateString() || "";
  const formatDisplayTime = (date) => date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "";

  // Initialize user
  useEffect(() => {
    if (!token) navigate("/login");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(parseInt(storedUserId));
  }, [token, navigate]);

  // Check block status
  const checkBothBlockStatus = useCallback(async () => {
    if (!userId || !receiverId) return;

    try {
      const [blockedByMeRes, blockedByThemRes] = await Promise.all([
        axios.get(
            `http://localhost:1217/api/messages/is-blocked?blockerId=${userId}&blockedId=${receiverId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        ),
        axios.get(
            `http://localhost:1217/api/messages/is-blocked?blockerId=${receiverId}&blockedId=${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
      ]);

      setBlockedByMe(blockedByMeRes.data);
      setBlockedByThem(blockedByThemRes.data);
      setIsBlocked(blockedByMeRes.data || blockedByThemRes.data);
    } catch (err) {
      console.error("Error checking block status", err);
    }
  }, [userId, receiverId, token]);

  // Block/unblock user
  const handleBlockUser = async () => {
    if (!userId || !receiverId || isBlocking) return;

    try {
      setIsBlocking(true);

      if (blockedByMe) {
        // Unblock
        await axios.post(
            `http://localhost:1217/api/messages/unblock`,
            {
              blockerId: userId,
              blockedId: parseInt(receiverId)
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
        );
        setBlockedByMe(false);
        setIsBlocked(blockedByThem);
      } else {
        // Block
        await axios.post(
            `http://localhost:1217/api/messages/block`,
            {
              blockerId: userId,
              blockedId: parseInt(receiverId)
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
        );
        setBlockedByMe(true);
        setIsBlocked(true);
      }

      await checkBothBlockStatus();
      await fetchMessages();
    } catch (err) {
      console.error("Block/unblock error", err);
      if (err.response?.status === 403) {
        alert("Action not authorized");
      }
    } finally {
      setIsBlocking(false);
    }
  };

  const handleReportUser = async () => {
    if (!userId || !receiverId) return;

    const reason = prompt("Pourquoi souhaitez-vous signaler cet utilisateur ?");
    if (!reason) return;

    try {
      setIsProcessing(true);
      await axios.post(
          `http://localhost:1217/api/v1/users/${receiverId}/report`,
          { reason: reason }, // Ensure this is an object with "reason" property
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json' // Explicit content type
            }
          }
      );
      alert("Utilisateur signalé avec succès");
    } catch (err) {
      console.error("Error reporting user", err);
      if (err.response?.data) {
        alert(err.response.data); // Show server error message if available
      } else {
        alert("Erreur lors du signalement");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Report message
  const handleReportMessage = async (messageId) => {
    if (!messageId) return;

    const reason = prompt("Pourquoi souhaitez-vous signaler ce message ?");
    if (!reason) return;

    try {
      setIsProcessing(true);
      await axios.post(
          `http://localhost:1217/api/messages/${messageId}/report`,
          { reason },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Message signalé avec succès");
      setSelectedMessageId(null);
    } catch (err) {
      console.error("Error reporting message", err);
      alert("Erreur lors du signalement");
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!userId || !receiverId) return;

    try {
      const res = await axios.get(
          `http://localhost:1217/api/messages/conversation?user1=${userId}&user2=${receiverId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
      res.data.forEach((msg) => {
        if (msg.receiverId === userId && !msg.read) {
          markMessageAsRead(msg.id);
        }
      });
    } catch (err) {
      console.error("Error loading messages", err);
    }
  }, [userId, receiverId, token]);

  // Fetch receiver info
  const fetchReceiverInfo = useCallback(async () => {
    if (!receiverId) return;

    try {
      const res = await axios.get(
          `http://localhost:1217/api/search/profile/${receiverId}?role=${receiverRole}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setReceiverInfo(res.data);

      const imgRes = await axios.get(
          `http://localhost:1217/api/search/image?userId=${receiverId}&role=${receiverRole}`,
          {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` }
          }
      );
      setReceiverImage(URL.createObjectURL(imgRes.data));
    } catch (err) {
      console.error("Error loading profile", err);
      setReceiverImage(DEFAULT_PROFILE_PICTURE);
    }
  }, [receiverId, token, receiverRole]);

  // Mark message as read
  const markMessageAsRead = useCallback(async (messageId) => {
    try {
      await axios.post(
          `http://localhost:1217/api/messages/${messageId}/read`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
      );

      setConversations(prev => prev.map(conv => {
        if (conv.userId === parseInt(receiverId)) {
          return {
            ...conv,
            unreadCount: Math.max(0, conv.unreadCount - 1)
          };
        }
        return conv;
      }));
    } catch (err) {
      console.error("Error marking message as read", err);
    }
  }, [token, receiverId]);

  // Fetch conversation images
  const fetchConversationImages = useCallback(async (convs) => {
    const newImages = {};
    await Promise.all(
        convs.map(async (conv) => {
          try {
            const res = await axios.get(
                `http://localhost:1217/api/search/image?userId=${conv.userId}&role=${conv.role}`,
                {
                  responseType: "blob",
                  headers: { Authorization: `Bearer ${token}` }
                }
            );
            newImages[conv.userId] = URL.createObjectURL(res.data);
          } catch (err) {
            newImages[conv.userId] = DEFAULT_PROFILE_PICTURE;
          }
        })
    );
    setConversationImages(newImages);
  }, [token]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    try {
      setLoadingConversations(true);
      const res = await axios.get(
          `http://localhost:1217/api/messages/conversations/history?userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      const sortedConversations = res.data.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      });

      setConversations(sortedConversations);
      fetchConversationImages(sortedConversations);
    } catch (err) {
      console.error("Error loading conversations", err);
    } finally {
      setLoadingConversations(false);
    }
  }, [userId, token, fetchConversationImages]);

  // Initialize data
  useEffect(() => {
    if (userId && receiverId) {
      fetchMessages();
      fetchReceiverInfo();
      checkBothBlockStatus();
    }
  }, [userId, receiverId, fetchMessages, fetchReceiverInfo, checkBothBlockStatus]);

  useEffect(() => {
    if (userId) fetchConversations();
  }, [userId, fetchConversations]);

  useEffect(() => {
    if (conversations.length > 0) {
      fetchConversationImages(conversations);
    }
  }, [conversations, fetchConversationImages]);

  // WebSocket connection
  useEffect(() => {
    if (!userId || !receiverId || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:1217/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        console.log("✅ WebSocket connected");

        client.subscribe(`/topic/messages/${userId}`, async (msgOutput) => {
          const message = JSON.parse(msgOutput.body);
          const isCurrentChat = message.senderId === parseInt(receiverId) && message.receiverId === userId;

          if (isCurrentChat) {
            if (message.receiverId === userId) {
              await markMessageAsRead(message.id);
              message.read = true;
            }
            setMessages((prevMessages) => [...prevMessages, message]);
          }
        });

        client.subscribe(`/topic/messages/update/${userId}`, (updateOutput) => {
          const updatedMessage = JSON.parse(updateOutput.body);

          setMessages(prevMessages => {
            if (updatedMessage.completelyDeleted) {
              return prevMessages.filter(msg => msg.id !== updatedMessage.id);
            }

            return prevMessages.map(msg =>
                msg.id === updatedMessage.id ? updatedMessage : msg
            );
          });
          fetchConversations();
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) stompClientRef.current.deactivate();
    };
  }, [userId, receiverId, token, markMessageAsRead, fetchConversations]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId || !receiverId || isBlocked) return;

    try {
      const res = await axios.post(
          `http://localhost:1217/api/messages`,
          {
            senderId: userId,
            receiverId: parseInt(receiverId),
            content: newMessage
          },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      const sentMessage = res.data;

      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: `/app/chat/${receiverId}`,
          body: JSON.stringify(sentMessage),
        });
      }

      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
      fetchConversations();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      setIsProcessing(true);
      await axios.delete(
          `http://localhost:1217/api/messages/${messageId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prevMessages =>
          prevMessages.filter(msg => msg.id !== messageId)
      );

      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: `/app/chat/${messageId}/delete/${userId}`,
          body: JSON.stringify({}),
        });
      }

      fetchConversations();
    } catch (err) {
      console.error("Error deleting message", err);
    } finally {
      setIsProcessing(false);
      setSelectedMessageId(null);
    }
  };

  // Edit message
  const startEditing = (message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleEditMessage = async () => {
    if (!editContent.trim() || !editingMessageId) return;

    try {
      setIsProcessing(true);
      await axios.put(
          `http://localhost:1217/api/messages/${editingMessageId}/edit/${userId}`,
          editContent,
          { headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'text/plain'
            }}
      );

      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: `/app/chat/${editingMessageId}/edit/${userId}`,
          body: editContent,
        });
      }

      setEditingMessageId(null);
      setEditContent("");
      fetchMessages();
    } catch (err) {
      console.error("Error editing message", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper functions
  const shouldDisplayMessage = (msg) => {
    if (msg.completelyDeleted) return false;
    return true;
  };

  const shouldDisplayConversation = (conv) => {
    if (!conv.lastMessage || conv.lastMessage === "Message supprimé") {
      return false;
    }
    return true;
  };

  const handleMessageClick = (messageId, event) => {
    event.stopPropagation();
    setSelectedMessageId(selectedMessageId === messageId ? null : messageId);
  };

  return (
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>Discussions</h3>
            {loadingConversations && <div style={styles.loadingIndicator}>Chargement...</div>}
          </div>
          <div style={styles.conversationList}>
            {conversations
                .filter(shouldDisplayConversation)
                .map((conv) => {
                  const isActive = parseInt(receiverId) === conv.userId;
                  const hasUnread = conv.unreadCount > 0;
                  const conversationTime = formatDisplayTime(new Date(conv.timestamp));

                  return (
                      <div
                          key={conv.userId}
                          onClick={() => navigate(`/ChatPage?receiverId=${conv.userId}&role=${conv.role}`)}
                          style={{
                            ...styles.conversationItem,
                            backgroundColor: isActive
                                ? COLORS.veryLightBlue2
                                : hasUnread
                                    ? "#f5f5f5"
                                    : "#ffffff",
                          }}
                      >
                        <img
                            src={conversationImages[conv.userId] || DEFAULT_PROFILE_PICTURE}
                            alt="Profil"
                            style={styles.conversationAvatar}
                        />
                        <div style={styles.conversationContent}>
                          <div style={styles.conversationHeader}>
                            <strong style={{
                              ...styles.conversationName,
                              fontWeight: hasUnread ? "600" : "500",
                              color: hasUnread ? COLORS.darkBlueGreen : "#333333"
                            }}>
                              {conv.firstname} {conv.lastname}
                            </strong>
                            <span style={styles.conversationTime}>
                        {conversationTime}
                      </span>
                          </div>
                          <div style={styles.conversationPreview}>
                            <p style={{
                              ...styles.conversationLastMessage,
                              fontWeight: hasUnread ? "500" : "400"
                            }}>
                              {conv.lastMessage?.length > 25
                                  ? `${conv.lastMessage.substring(0, 25)}...`
                                  : conv.lastMessage}
                            </p>
                            {hasUnread && (
                                <span style={styles.unreadBadge}>
                          {conv.unreadCount}
                        </span>
                            )}
                          </div>
                        </div>
                      </div>
                  );
                })}
          </div>
        </div>

        <div style={styles.chatArea}>
          {receiverId && (
              <div style={styles.chatHeader}>
                <div style={styles.chatHeaderInfo}>
                  {receiverInfo && (
                      <>
                        <img src={receiverImage} alt="Profil" style={styles.chatAvatar} />
                        <div>
                          <h3 style={styles.chatTitle}>
                            {receiverInfo.firstname} {receiverInfo.lastname}
                          </h3>
                          <p style={styles.chatStatus}>
                            {receiverInfo.role}
                          </p>
                        </div>
                      </>
                  )}
                </div>
                <div style={styles.chatHeaderActions}>
                  <button
                      onClick={handleReportUser}
                      disabled={isProcessing}
                      style={styles.reportButton}
                  >
                    <FiAlertTriangle style={{ marginRight: 5 }} /> Signaler
                  </button>
                  <button
                      onClick={handleBlockUser}
                      disabled={isBlocking || blockedByThem}
                      style={{
                        ...styles.blockButton,
                        backgroundColor: blockedByMe ? COLORS.lightBlueGreen : COLORS.primary,
                        cursor: blockedByThem ? 'not-allowed' : 'pointer',
                        opacity: blockedByThem ? 0.6 : 1
                      }}
                  >
                    {isBlocking
                        ? "..."
                        : blockedByThem
                            ? <><FiPhoneOff style={{ marginRight: 5 }} /> Bloqué</>
                            : blockedByMe
                                ? <><FiUnlock style={{ marginRight: 5 }} />Débloquer</>
                                : <><FiLock style={{ marginRight: 5 }} />Bloquer</>}
                  </button>
                </div>
              </div>
          )}

          <div style={styles.messagesContainer}>
            {messages
                .filter(shouldDisplayMessage)
                .map((msg, index) => {
                  const messageDate = formatDate(msg.timestamp);
                  const displayTime = formatDisplayTime(messageDate);
                  const displayDate = formatDisplayDate(messageDate);
                  const prevMessageDate = index > 0 ? formatDate(messages[index-1].timestamp) : null;
                  const prevDisplayDate = prevMessageDate ? formatDisplayDate(prevMessageDate) : null;

                  return (
                      <div key={msg.id || index} style={styles.messageWrapper}>
                        <div style={{
                          ...styles.messageContainer,
                          alignItems: msg.senderId === userId ? "flex-end" : "flex-start",
                        }}>
                          {(index === 0 || displayDate !== prevDisplayDate) && displayDate && (
                              <div style={styles.messageDate}>
                                {displayDate}
                              </div>
                          )}

                          {editingMessageId === msg.id ? (
                              <div style={{
                                ...styles.messageBubble,
                                backgroundColor: msg.senderId === userId ?  "#ffffff" : "#F0F0F0" ,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px'
                              }}>
                                <input
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    style={styles.editInput}
                                    disabled={isProcessing}
                                />
                                <div style={styles.editButtons}>
                                  <button
                                      onClick={handleEditMessage}
                                      disabled={isProcessing}
                                      style={styles.saveEditButton}
                                  >
                                    {isProcessing ? "En cours..." : "Enregistrer"}
                                  </button>
                                  <button
                                      onClick={cancelEditing}
                                      disabled={isProcessing}
                                      style={styles.cancelEditButton}
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                          ) : (
                              <div
                                  onClick={(e) => handleMessageClick(msg.id, e)}
                                  style={{
                                    ...styles.messageBubble,
                                    backgroundColor: msg.senderId === userId ? "#ffffff" : "#F0F0F0",
                                    position: "relative"
                                  }}
                              >
                                <div style={styles.messageContent}>
                                  <div style={styles.messageText}>{msg.content}</div>
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    gap: '4px',
                                    marginTop: '-7px'
                                  }}>
                                    {msg.edited && (
                                        <span style={{
                                          color: '#999999',
                                          fontSize: '10px'
                                        }}>
                                (modifié)
                              </span>
                                    )}
                                    {displayTime && (
                                        <span style={{
                                          color: '#999999',
                                          fontSize: '10px'
                                        }}>
                                {displayTime}
                              </span>
                                    )}
                                    {msg.senderId === userId && (
                                        <span style={{
                                          color: msg.read ? COLORS.vividCyan : '#999999',
                                          display: 'flex',
                                          alignItems: 'center'
                                        }}>
                                {msg.read ? <FiCheckCircle size={12} /> : <FiCheck size={12} />}
                              </span>
                                    )}
                                  </div>
                                </div>

                                {selectedMessageId === msg.id && (
                                    <div ref={menuRef} style={styles.messageMenu}>
                                      {msg.senderId === userId && (
                                          <>
                                            <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  startEditing(msg);
                                                  setSelectedMessageId(null);
                                                }}
                                                disabled={isProcessing}
                                                style={{ ...styles.menuItem, color: COLORS.primary }}
                                            >
                                              <FiEdit2 style={{ ...styles.menuIcon, color: COLORS.primary }} /> Modifier
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteMessage(msg.id);
                                                  setSelectedMessageId(null);
                                                }}
                                                disabled={isProcessing}
                                                style={{ ...styles.menuItem, color: "#f44336" }}
                                            >
                                              <FiTrash2 style={{ marginRight: 5, color: "#f44336" }} /> Supprimer
                                            </button>
                                          </>
                                      )}
                                      <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleReportMessage(msg.id);
                                          }}
                                          disabled={isProcessing}
                                          style={{ ...styles.menuItem, color: "#ff9800" }}
                                      >
                                        <FiAlertTriangle style={{ marginRight: 5, color: "#ff9800" }} /> Signaler
                                      </button>
                                    </div>
                                )}
                              </div>
                          )}
                        </div>
                      </div>
                  );
                })}
            <div ref={messagesEndRef} />
          </div>

          {receiverId && rawRole && !isBlocked && (
              <div style={styles.messageInputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Écrivez un message..."
                    style={styles.messageInput}
                    disabled={isProcessing}
                />
                <button
                    onClick={handleSendMessage}
                    style={styles.sendButton}
                    disabled={isProcessing || !newMessage.trim()}
                >
                  <FiSend style={{ marginRight: 5 }} /> Envoyer
                </button>
              </div>
          )}

          {receiverId && rawRole && isBlocked && (
              <div style={styles.blockedInput}>
                <p>
                  {blockedByMe
                      ? <><FiLock style={{ marginRight: 5 }} />Vous avez bloqué cet utilisateur. Vous ne pouvez pas envoyer de messages.</>
                      : <><FiPhoneOff style={{ marginRight: 5 }} />Cet utilisateur vous a bloqué. Vous ne pouvez pas envoyer de messages.</>}
                </p>
              </div>
          )}

          {!receiverId && (
              <div style={styles.noRecipientMessage}>
                <p><FiMessageSquare style={{ marginRight: 5 }} />Sélectionnez une conversation pour envoyer un message</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default ChatPage;