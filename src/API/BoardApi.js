import axios from 'axios';

const Board_API_BASE_URL = "http://localhost:8000/board";

class BoardApiService {

    fetchBoards() {
        return axios.get(Board_API_BASE_URL);
    }
    fetchTopMainBoards() {
        return axios.get(Board_API_BASE_URL + '/fetchtopmainboards');
    }
    fetchBoardsLiked() {
        return axios.get(Board_API_BASE_URL+'/likedorder');
    }
    fetchBoardsSave(){
        return axios.get(Board_API_BASE_URL+'/save');
    }

    fetchBoardByID(boardID) {
        return axios.get(Board_API_BASE_URL + '/' + boardID);
    }
    deleteBoard(boardID) {
        return axios.delete(Board_API_BASE_URL + '/' + boardID);
    }
    editBoard(board) {
        return axios.put(Board_API_BASE_URL + '/' + board.board_id, board)
    }
    addBoard(board) {
        return axios.post(Board_API_BASE_URL, board);
    }
        
    fetchLikeUserBoardCheck(UserLikeBoard) {
        return axios.get(Board_API_BASE_URL +"/"+UserLikeBoard.board_id+"/"+UserLikeBoard.userid+ '/likecheck');
    }

    addLikedUserBoard(UserLikeBoard){
        return axios.post(Board_API_BASE_URL + "/like", UserLikeBoard);
    }
    deleteLikedUserBoard(UserLikeBoard) {
        // return axios.delete(Board_API_BASE_URL + '/like'+"/?board_id="+UserLikeBoard.board_id+"&userid="+UserLikeBoard.userid);
        return axios.delete(Board_API_BASE_URL + '/like'+"/"+UserLikeBoard.board_id+"/"+UserLikeBoard.userid);
        // return axios.delete(Board_API_BASE_URL + '/like');
    }

    fetchSavedUserBoardCheck(userid) {
        return axios.get(Board_API_BASE_URL + '/savedboardCheck'+"/"+userid);
    }
    addSaveddUserBoard(UserSavedBoard){
        return axios.post(Board_API_BASE_URL + "/saved", UserSavedBoard);
    }

    deleteSaveddUserBoard(UserSavedBoard){
        return axios.delete(Board_API_BASE_URL + "/saved/"+UserSavedBoard.board_id+"/"+UserSavedBoard.userid);
    }


    fetchSavedUserBoard(userid) {
        return axios.get(Board_API_BASE_URL + '/savedboard'+"/"+userid);
    }
    fetchSavedUserBoardLiked(userid) {
        return axios.get(Board_API_BASE_URL + '/savedboardLiked'+"/"+userid);
    }


    // addUserLikeBoard(user) {
    //     return axios.post(Board_API_BASE_URL, user);
    // }
    



    // editUser(user) {
    //     return axios.put(Board_API_BASE_URL + '/' + user.id, user)
    // }
 
}

export default new BoardApiService();