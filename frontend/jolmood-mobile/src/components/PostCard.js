import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { PostService } from "../services/PostService";
import CommentBox from "./CommentBox";

export default function PostCard({ item, onChanged }) {
  const [comment, setComment] = useState("");

  const like = async () => {
    try {
      await PostService.like(item.id);
      onChanged && onChanged();
    } catch {
      Alert.alert("Info", "Déjà liké ou erreur");
    }
  };

  const send = async () => {
    if (!comment.trim()) return;
    try {
      await PostService.comment(item.id, { content: comment });
      setComment("");
      onChanged && onChanged();
    } catch {
      Alert.alert("Erreur", "Impossible de commenter");
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ fontWeight: "700", marginBottom: 6 }}>{item.content}</Text>
      {item.media_url ? (
        <Text style={{ opacity: 0.7, marginBottom: 6 }}>{item.media_url}</Text>
      ) : null}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
        <TouchableOpacity
          onPress={like}
          style={{
            backgroundColor: "#111827",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff" }}>Like</Text>
        </TouchableOpacity>
      </View>

      {/* Section commentaires */}
      <CommentBox postId={item.id} onCommentAdded={onChanged} />
    </View>
  );
}
