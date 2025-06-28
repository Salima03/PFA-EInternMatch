export const COLORS = {
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
export const styles = {
    container: {
        display: "flex",
        height: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: COLORS.veryLightBlue2,
    },
    sidebar: {
        width: "350px",
        borderRight: `1px solid white`,
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
    },
    sidebarHeader: {
        padding: "20px",
        borderBottom: `1px solid white`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    sidebarTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "600",
        color: COLORS.darkBlueGreen,
    },
    loadingIndicator: {
        fontSize: "12px",
        color: COLORS.secondary,
    },
    conversationList: {
        flex: 1,
        overflowY: "auto",
    },
    conversationItem: {
        display: "flex",
        alignItems: "center",
        padding: "12px 15px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        borderBottom: `1px solid white`,
        '&:hover': {
            backgroundColor: COLORS.veryLightBlue2,
        }
    },
    conversationAvatar: {
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        marginRight: "12px",
        objectFit: "cover",
        border: `2px solid ${COLORS.lightBlue}`,
    },
    conversationContent: {
        flex: 1,
        minWidth: 0,
    },
    conversationHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "4px",
    },
    conversationName: {
        fontSize: "14px",
        fontWeight: "600",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "70%",
        color: COLORS.darkBlueGreen,
    },
    conversationTime: {
        fontSize: "11px",
        color: COLORS.secondary,
    },
    conversationPreview: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    conversationLastMessage: {
        fontSize: "13px",
        color: COLORS.darkBlueGreen,
        margin: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "80%",
    },
    unreadBadge: {
        backgroundColor: COLORS.primary,
        color: "white",
        borderRadius: "50%",
        minWidth: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: "bold",
    },
    chatArea: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLORS.veryLightBlue2,
    },
    chatHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 20px",
        backgroundColor: "#ffffff",
        borderBottom: `1px solid white`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    },
    chatHeaderInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    chatAvatar: {
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        marginRight: "15px",
        objectFit: "cover",
        border: `1px solid ${COLORS.lightBlue}`,
    },
    chatTitle: {
        margin: 0,
        fontSize: "16px",
        fontWeight: "500",
        color: COLORS.darkBlueGreen,
    },
    chatStatus: {
        margin: 0,
        fontSize: "13px",
        color: COLORS.secondary,
    },
    messagesContainer: {
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        background: COLORS.veryLightBlue2,
        backgroundImage: "url('https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png')",
    },
    messageWrapper: {
        display: "flex",
        marginBottom: "2px",
        width: "100%",
    },
    messageContainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    messageDate: {
        alignSelf: "center",
        backgroundColor: "rgba(225,245,254,0.92)",
        padding: "5px 12px",
        borderRadius: "7.5px",
        fontSize: "12.5px",
        color: COLORS.darkBlueGreen,
        margin: "10px 0",
        fontWeight: "500",
        boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
    },
    messageBubble: {
        maxWidth: "70%",
        padding: "10px 12px 10px 8px",
        borderRadius: "7.5px",
        position: "relative",
        marginBottom: "2px",
        boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
    },
    messageContent: {
        display: "flex",
        flexDirection: "column",
    },
    messageText: {
        fontSize: "14.2px",
        lineHeight: "1.4",
        wordBreak: "break-word",
        marginRight: "40px",
        marginBottom: "7px",
    },
    messageMeta: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        float: "right",
        margin: "-10px -5px -5px 5px",
        position: "relative",
        height: "15px",
    },
    messageTime: {
        fontSize: "11px",
        color: COLORS.darkBlueGreen,
        marginRight: "3px",
        letterSpacing: "-0.3px",
        transform: "translateY(1px)",
    },
    messageStatus: {
        fontSize: "13px",
        marginLeft: "3px",
        letterSpacing: "-1px",
        transform: "translateY(-0.1px)",
    },
    editedLabel: {
        fontSize: "11px",
        color: COLORS.secondary,
        marginLeft: "4px",
        fontStyle: "italic",
    },
    messageMenu: {
        position: "absolute",
        right: 0,
        top: "100%",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 10,
        minWidth: "150px",
        overflow: "hidden",
        marginTop: "5px",
    },
    menuItem: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "8px 12px",
        border: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
        fontSize: "14px",
        textAlign: "left",
        '&:hover': {
            backgroundColor: COLORS.veryLightBlue2,
        }
    },
    menuIcon: {
        marginRight: "8px",
        fontSize: "16px",
        color: COLORS.primary,
    },
    editInput: {
        padding: "10px",
        borderRadius: "8px",
        border: `1px solid ${COLORS.lightBlue}`,
        width: "90%",
        fontSize: "15px",
        marginBottom: "5px",
        outline: "none",
    },
    editButtons: {
        display: "flex",
        gap: "5px",
        justifyContent: "flex-end",
    },
    saveEditButton: {
        padding: "6px 12px",
        backgroundColor: COLORS.primary,
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: COLORS.darkBlueGreen,
        }
    },
    cancelEditButton: {
        padding: "6px 12px",
        backgroundColor:"#f44336",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: "#f44336",
        }
    },
    messageInputContainer: {
        display: "flex",
        padding: "15px",
        backgroundColor: "#ffffff",
        borderTop: `1px solid white`,
    },
    messageInput: {
        flex: 1,
        padding: "12px 15px",
        borderRadius: "24px",
        border: `1px solid ${COLORS.lightBlue}`,
        outline: "none",
        fontSize: "15px",
        '&:focus': {
            borderColor: COLORS.primary,
        }
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        color: "white",
        border: "none",
        padding: "0 20px",
        borderRadius: "24px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "500",
        marginLeft: "10px",
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: COLORS.darkBlueGreen,
        },
        '&:disabled': {
            backgroundColor: COLORS.lightBlueGreen,
            cursor: "not-allowed",
        }
    },
    noRecipientMessage: {
        padding: "20px",
        textAlign: "center",
        color: COLORS.darkBlueGreen,
        fontStyle: "italic",
        backgroundColor: "#fff",
        borderTop: `1px solid ${COLORS.lightBlue}`
    },
    chatHeaderActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    blockButton: {
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: COLORS.coral,
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s',
        '&:hover': {
            backgroundColor: '#ff7043',
        },
        '&:disabled': {
            backgroundColor: '#ffccbc',
            cursor: 'not-allowed'
        }
    },
    unblockButton: {
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: COLORS.pastelGreen,
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s',
        '&:hover': {
            backgroundColor: '#81c784',
        }
    },
    blockedMessage: {
        padding: '20px',
        textAlign: 'center',
        color: '#f44336',
        backgroundColor: '#ffebee',
        borderRadius: '5px',
        margin: '20px'
    },
    blockedInput: {
        padding: '10px',
        textAlign: 'center',
        backgroundColor: '#ffe6e6',
        color: '#ff0000',
        borderTop: `1px solid white`,
        fontSize: '14px'
    },
    blockedByThemText: {
        color: COLORS.coral,
        fontSize: '14px',
        marginRight: '10px'
    },
    blockStatus: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '10px'
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.veryLightBlue,
        borderTopRightRadius: '0',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        borderTopLeftRadius: '0',
    },
    activeConversationItem: {
        backgroundColor: COLORS.veryLightBlue2,
    },

    reportButton: {
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#ff9800',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        marginRight: '10px',
        '&:hover': {
            backgroundColor: '#f57c00',
        },
        '&:disabled': {
            backgroundColor: '#ffcc80',
            cursor: 'not-allowed'
        }
    },

};