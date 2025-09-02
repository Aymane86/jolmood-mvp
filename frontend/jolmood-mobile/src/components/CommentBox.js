import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { PostService } from "../services/PostService";

export default function CommentBox({ postId, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    try {
      const res = await PostService.comments(postId);
      setComments(res.data || []);
    } catch (e) {
      console.log("Erreur chargement commentaires:", e);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await PostService.comment(postId, { content: newComment });
      setNewComment("");
      await loadComments();
      onCommentAdded && onCommentAdded();
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'ajouter le commentaire");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  return (
    <View style={{ marginTop: 8 }}>
      {/* Liste des commentaires */}
      {comments.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: "600", marginBottom: 8, fontSize: 14 }}>
            Commentaires ({comments.length})
          </Text>
          <FlatList
            data={comments}
            keyExtractor={(item, idx) => String(item.id || idx)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#f9fafb",
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "500" }}>
                  {item.user_name || "Utilisateur"}
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                  {item.content}
                </Text>
                <Text style={{ fontSize: 10, opacity: 0.5, marginTop: 4 }}>
                  {item.created_at}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Formulaire d'ajout */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChangeText={setNewComment}
          style={{
            flex: 1,
            backgroundColor: "#f3f4f6",
            padding: 8,
            borderRadius: 8,
            fontSize: 12,
          }}
          multiline
        />
        <TouchableOpacity
          onPress={addComment}
          disabled={loading || !newComment.trim()}
          style={{
            backgroundColor:
              loading || !newComment.trim() ? "#9ca3af" : "#111827",
            padding: 8,
            borderRadius: 8,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
            {loading ? "..." : "Envoyer"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
