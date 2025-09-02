// Service de validation pour les formulaires
export const ValidationService = {
  // Validation email
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.trim() === "") {
      return { valid: false, message: "L'email est requis" };
    }
    if (!emailRegex.test(email)) {
      return { valid: false, message: "Format d'email invalide" };
    }
    return { valid: true };
  },

  // Validation mot de passe
  password: (password) => {
    if (!password || password.length < 6) {
      return {
        valid: false,
        message: "Le mot de passe doit contenir au moins 6 caractères",
      };
    }
    return { valid: true };
  },

  // Validation nom
  name: (name) => {
    if (!name || name.trim().length < 2) {
      return {
        valid: false,
        message: "Le nom doit contenir au moins 2 caractères",
      };
    }
    return { valid: true };
  },

  // Validation téléphone
  phone: (phone) => {
    if (!phone || phone.trim() === "") {
      return { valid: false, message: "Le téléphone est requis" };
    }
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    if (!phoneRegex.test(phone)) {
      return { valid: false, message: "Format de téléphone invalide" };
    }
    return { valid: true };
  },

  // Validation contenu post
  postContent: (content) => {
    if (!content || content.trim().length < 1) {
      return { valid: false, message: "Le contenu ne peut pas être vide" };
    }
    if (content.length > 1000) {
      return {
        valid: false,
        message: "Le contenu ne peut pas dépasser 1000 caractères",
      };
    }
    return { valid: true };
  },

  // Validation date RDV
  appointmentDate: (date) => {
    if (!date) {
      return { valid: false, message: "La date est requise" };
    }
    const appointmentDate = new Date(date);
    const now = new Date();

    if (isNaN(appointmentDate.getTime())) {
      return { valid: false, message: "Format de date invalide" };
    }

    if (appointmentDate <= now) {
      return { valid: false, message: "La date doit être dans le futur" };
    }

    return { valid: true };
  },

  // Validation UUID (pour coach_id, user_id)
  uuid: (uuid) => {
    if (!uuid || uuid.trim() === "") {
      return { valid: false, message: "L'ID est requis" };
    }
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      return { valid: false, message: "Format d'ID invalide" };
    }
    return { valid: true };
  },

  // Validation complète d'inscription
  registration: (data) => {
    const errors = {};

    const nameValidation = this.name(data.name);
    if (!nameValidation.valid) errors.name = nameValidation.message;

    const emailValidation = this.email(data.email);
    if (!emailValidation.valid) errors.email = emailValidation.message;

    const phoneValidation = this.phone(data.phone);
    if (!phoneValidation.valid) errors.phone = phoneValidation.message;

    const passwordValidation = this.password(data.password);
    if (!passwordValidation.valid) errors.password = passwordValidation.message;

    if (!data.role || !["particulier", "coach"].includes(data.role)) {
      errors.role = "Rôle invalide";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};







