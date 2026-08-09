(function (root, factory) {
  if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VT = root.VT || Object.assign({}, factory());
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const DICT = {
    en: {
      _name: "English",
      nav_dashboard: "Dashboard",
      nav_transferHistory: "Transfer History",
      nav_statement: "Statement",
      nav_stocks: "Invest / Stocks",
      nav_card: "Cards",
      nav_international: "International Transfer",
      nav_profile: "My Profile",
      nav_kyc: "KYC / Profile Setup",
      nav_pin: "Account PIN",
      nav_password: "Password",
      nav_logout: "Logout",
      top_search: "Search…",
      hero_welcome: "Welcome back",
      hero_accountNo: "Account No.",
      hero_status: "Status",
      hero_balance: "Available Balance",
      hero_viewDetails: "View Details",
      hero_viewStatement: "View Statement",
      actions_transfer: "Transfer",
      actions_deposit: "Deposit",
      actions_withdraw: "Withdraw",
      actions_bills: "Pay Bills",
      actions_card: "Cards",
      actions_invest: "Invest",
      actions_loan: "Loans",
      actions_support: "Support",
      actions_more: "More",
      quick_balance: "Quick Balance",
      quick_today: "Today",
      quick_week: "This Week",
      quick_month: "This Month",
      quick_in: "Money In",
      quick_out: "Money Out",
      recent_title: "Recent Transactions",
      recent_viewAll: "View All",
      recent_empty: "No transactions yet.",
      recent_date: "Date",
      recent_type: "Type",
      recent_desc: "Description",
      recent_amount: "Amount",
      recent_status: "Status",
      cards_title: "My Cards",
      cards_addCard: "Add Card",
      stocks_title: "Markets & Investing",
      stocks_price: "Price",
      stocks_change: "Change",
      stocks_buy: "Buy",
      stocks_sell: "Sell",
      profile_title: "My Profile",
      profile_subtitle: "Review and update your personal information.",
      profile_save: "Save Changes",
      profile_updated: "Profile updated.",
      kyc_title: "Complete Your Profile / KYC",
      kyc_subtitle: "Please fill in your details and choose a language to unlock your dashboard.",
      kyc_required_warning: "All required fields must be completed before you can use your account.",
      kyc_firstname: "First Name",
      kyc_lastname: "Last Name",
      kyc_phone: "Phone Number",
      kyc_gender: "Gender",
      kyc_gender_male: "Male",
      kyc_gender_female: "Female",
      kyc_gender_other: "Other",
      kyc_gender_prefernotsay: "Prefer not to say",
      kyc_dob: "Date of Birth",
      kyc_nationality: "Nationality",
      kyc_occupation: "Occupation",
      kyc_country: "Country",
      kyc_address: "Street Address",
      kyc_city: "City",
      kyc_state: "State / Province",
      kyc_zip: "ZIP / Postal Code",
      kyc_language: "Preferred Language",
      kyc_submit: "Complete Setup",
      kyc_submitting: "Saving…",
      kyc_success: "Setup complete. Your dashboard has been translated to your preferred language.",
      kyc_required: "This field is required",
      kyc_genericError: "Unable to save. Please try again.",
      status_ACTIVE: "Active",
      status_PENDING: "Pending",
      status_SUSPENDED: "Suspended",
      status_COMPLETED: "Completed",
      status_PROCESSING: "Processing",
      status_FAILED: "Failed",
      th_title: "Transfer History",
      th_from_to: "From / To",
      th_ref: "Reference",
      th_filterAll: "All",
      th_filterSent: "Sent",
      th_filterReceived: "Received",
      th_filterPending: "Pending",
      th_exportCsv: "Export CSV",
      th_search: "Search transfers…",
      th_empty: "No transfers found.",
      st_title: "Account Statement",
      st_period: "Period",
      st_from: "From",
      st_to: "To",
      st_downloadPdf: "Download PDF",
      st_downloadCsv: "Download CSV",
      st_openingBalance: "Opening Balance",
      st_closingBalance: "Closing Balance",
      st_totalIn: "Total In",
      st_totalOut: "Total Out",
      intl_title: "International Transfer",
      intl_sendAmount: "You Send",
      intl_receiveAmount: "Recipient Gets",
      intl_fee: "Fee",
      intl_rate: "Exchange Rate",
      intl_eta: "Estimated Arrival",
      intl_recipientName: "Recipient Name",
      intl_recipientAccount: "Recipient Account / IBAN",
      intl_recipientBank: "Bank Name",
      intl_recipientSwift: "SWIFT / BIC",
      intl_recipientCountry: "Recipient Country",
      intl_reference: "Payment Reference",
      intl_submit: "Review & Send",
      pin_title: "Account PIN",
      pin_current: "Current PIN",
      pin_new: "New PIN",
      pin_confirm: "Confirm New PIN",
      pin_save: "Update PIN",
      pin_saved: "PIN updated successfully.",
      pw_title: "Change Password",
      pw_current: "Current Password",
      pw_new: "New Password",
      pw_confirm: "Confirm New Password",
      pw_save: "Update Password",
      pw_saved: "Password updated successfully.",
      card_title: "My Card",
      card_virtual: "Virtual Card",
      card_physical: "Physical Card",
      card_activate: "Activate",
      card_freeze: "Freeze",
      card_cvv: "CVV",
      card_exp: "Expires",
      card_limit: "Monthly Limit",
      mk_title: "Markets",
      mk_topMovers: "Top Movers",
      mk_watchlist: "Watchlist",
      mk_portfolio: "My Portfolio",
      mk_portfolioValue: "Portfolio Value",
      mk_todaysGain: "Today's Gain",
      mk_totalGain: "Total Gain",
      search: "Search…",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      copy: "Copy",
      copied: "Copied!",
      submit: "Submit",
      continue: "Continue",
      error_generic: "Something went wrong. Please try again.",
      error_unauthorized: "Your session ended. Please sign in again.",
      logout_confirm: "Are you sure you want to sign out?",
      footer_rights: "All rights reserved.",
      common_required: "Required"
    },
    es: {
      _name: "Español",
      nav_dashboard: "Panel",
      nav_transferHistory: "Historial de Transferencias",
      nav_statement: "Estado de Cuenta",
      nav_stocks: "Invertir / Acciones",
      nav_card: "Tarjetas",
      nav_international: "Transferencia Internacional",
      nav_profile: "Mi Perfil",
      nav_kyc: "KYC / Configurar Perfil",
      nav_pin: "PIN de la Cuenta",
      nav_password: "Contraseña",
      nav_logout: "Cerrar Sesión",
      top_search: "Buscar…",
      hero_welcome: "Bienvenido de nuevo",
      hero_accountNo: "N.º de Cuenta",
      hero_status: "Estado",
      hero_balance: "Saldo Disponible",
      hero_viewDetails: "Ver Detalles",
      hero_viewStatement: "Ver Estado",
      actions_transfer: "Transferir",
      actions_deposit: "Depositar",
      actions_withdraw: "Retirar",
      actions_bills: "Pagar Facturas",
      actions_card: "Tarjetas",
      actions_invest: "Invertir",
      actions_loan: "Préstamos",
      actions_support: "Soporte",
      actions_more: "Más",
      quick_balance: "Saldo Rápido",
      quick_today: "Hoy",
      quick_week: "Esta Semana",
      quick_month: "Este Mes",
      quick_in: "Entradas",
      quick_out: "Salidas",
      recent_title: "Transacciones Recientes",
      recent_viewAll: "Ver Todas",
      recent_empty: "Aún no hay transacciones.",
      recent_date: "Fecha",
      recent_type: "Tipo",
      recent_desc: "Descripción",
      recent_amount: "Monto",
      recent_status: "Estado",
      cards_title: "Mis Tarjetas",
      cards_addCard: "Agregar Tarjeta",
      stocks_title: "Mercados e Inversiones",
      stocks_price: "Precio",
      stocks_change: "Cambio",
      stocks_buy: "Comprar",
      stocks_sell: "Vender",
      profile_title: "Mi Perfil",
      profile_subtitle: "Revisa y actualiza tu información personal.",
      profile_save: "Guardar Cambios",
      profile_updated: "Perfil actualizado.",
      kyc_title: "Completa tu Perfil / KYC",
      kyc_subtitle: "Por favor completa tus datos y elige un idioma para desbloquear tu panel.",
      kyc_required_warning: "Todos los campos obligatorios deben completarse antes de usar tu cuenta.",
      kyc_firstname: "Nombre",
      kyc_lastname: "Apellido",
      kyc_phone: "Número de Teléfono",
      kyc_gender: "Género",
      kyc_gender_male: "Masculino",
      kyc_gender_female: "Femenino",
      kyc_gender_other: "Otro",
      kyc_gender_prefernotsay: "Prefiero no decirlo",
      kyc_dob: "Fecha de Nacimiento",
      kyc_nationality: "Nacionalidad",
      kyc_occupation: "Ocupación",
      kyc_country: "País",
      kyc_address: "Dirección",
      kyc_city: "Ciudad",
      kyc_state: "Estado / Provincia",
      kyc_zip: "Código Postal",
      kyc_language: "Idioma Preferido",
      kyc_submit: "Completar Configuración",
      kyc_submitting: "Guardando…",
      kyc_success: "Configuración completa. Tu panel ha sido traducido a tu idioma preferido.",
      kyc_required: "Este campo es obligatorio",
      kyc_genericError: "No se pudo guardar. Inténtalo de nuevo.",
      status_ACTIVE: "Activo",
      status_PENDING: "Pendiente",
      status_SUSPENDED: "Suspendido",
      status_COMPLETED: "Completado",
      status_PROCESSING: "Procesando",
      status_FAILED: "Fallido",
      th_title: "Historial de Transferencias",
      th_from_to: "De / Para",
      th_ref: "Referencia",
      th_filterAll: "Todos",
      th_filterSent: "Enviados",
      th_filterReceived: "Recibidos",
      th_filterPending: "Pendientes",
      th_exportCsv: "Exportar CSV",
      th_search: "Buscar transferencias…",
      th_empty: "No se encontraron transferencias.",
      st_title: "Estado de Cuenta",
      st_period: "Periodo",
      st_from: "Desde",
      st_to: "Hasta",
      st_downloadPdf: "Descargar PDF",
      st_downloadCsv: "Descargar CSV",
      st_openingBalance: "Saldo Inicial",
      st_closingBalance: "Saldo Final",
      st_totalIn: "Total Entradas",
      st_totalOut: "Total Salidas",
      intl_title: "Transferencia Internacional",
      intl_sendAmount: "Envías",
      intl_receiveAmount: "Recibe",
      intl_fee: "Comisión",
      intl_rate: "Tipo de Cambio",
      intl_eta: "Llegada Estimada",
      intl_recipientName: "Nombre del Beneficiario",
      intl_recipientAccount: "Cuenta / IBAN del Beneficiario",
      intl_recipientBank: "Banco",
      intl_recipientSwift: "SWIFT / BIC",
      intl_recipientCountry: "País del Beneficiario",
      intl_reference: "Referencia",
      intl_submit: "Revisar y Enviar",
      pin_title: "PIN de la Cuenta",
      pin_current: "PIN Actual",
      pin_new: "Nuevo PIN",
      pin_confirm: "Confirmar Nuevo PIN",
      pin_save: "Actualizar PIN",
      pin_saved: "PIN actualizado correctamente.",
      pw_title: "Cambiar Contraseña",
      pw_current: "Contraseña Actual",
      pw_new: "Nueva Contraseña",
      pw_confirm: "Confirmar Nueva Contraseña",
      pw_save: "Actualizar Contraseña",
      pw_saved: "Contraseña actualizada correctamente.",
      card_title: "Mi Tarjeta",
      card_virtual: "Tarjeta Virtual",
      card_physical: "Tarjeta Física",
      card_activate: "Activar",
      card_freeze: "Congelar",
      card_cvv: "CVV",
      card_exp: "Vence",
      card_limit: "Límite Mensual",
      mk_title: "Mercados",
      mk_topMovers: "Mayores Movimientos",
      mk_watchlist: "Lista de Seguimiento",
      mk_portfolio: "Mi Portafolio",
      mk_portfolioValue: "Valor del Portafolio",
      mk_todaysGain: "Ganancia del Día",
      mk_totalGain: "Ganancia Total",
      search: "Buscar…",
      save: "Guardar",
      cancel: "Cancelar",
      close: "Cerrar",
      copy: "Copiar",
      copied: "¡Copiado!",
      submit: "Enviar",
      continue: "Continuar",
      error_generic: "Ocurrió un error. Inténtalo de nuevo.",
      error_unauthorized: "Tu sesión terminó. Por favor inicia sesión de nuevo.",
      logout_confirm: "¿Seguro que deseas cerrar sesión?",
      footer_rights: "Todos los derechos reservados.",
      common_required: "Obligatorio"
    },
    fr: {
      _name: "Français",
      nav_dashboard: "Tableau de bord",
      nav_transferHistory: "Historique des virements",
      nav_statement: "Relevé",
      nav_stocks: "Investir / Actions",
      nav_card: "Cartes",
      nav_international: "Virement international",
      nav_profile: "Mon profil",
      nav_kyc: "KYC / Configurer le profil",
      nav_pin: "Code PIN",
      nav_password: "Mot de passe",
      nav_logout: "Déconnexion",
      top_search: "Rechercher…",
      hero_welcome: "Bon retour",
      hero_accountNo: "N° de compte",
      hero_status: "Statut",
      hero_balance: "Solde disponible",
      hero_viewDetails: "Voir les détails",
      hero_viewStatement: "Voir le relevé",
      actions_transfer: "Virement",
      actions_deposit: "Dépôt",
      actions_withdraw: "Retrait",
      actions_bills: "Payer les factures",
      actions_card: "Cartes",
      actions_invest: "Investir",
      actions_loan: "Prêts",
      actions_support: "Support",
      actions_more: "Plus",
      quick_balance: "Solde rapide",
      quick_today: "Aujourd'hui",
      quick_week: "Cette semaine",
      quick_month: "Ce mois",
      quick_in: "Entrées",
      quick_out: "Sorties",
      recent_title: "Transactions récentes",
      recent_viewAll: "Voir tout",
      recent_empty: "Aucune transaction pour le moment.",
      recent_date: "Date",
      recent_type: "Type",
      recent_desc: "Description",
      recent_amount: "Montant",
      recent_status: "Statut",
      cards_title: "Mes cartes",
      cards_addCard: "Ajouter une carte",
      stocks_title: "Marchés & Investissements",
      stocks_price: "Prix",
      stocks_change: "Variation",
      stocks_buy: "Acheter",
      stocks_sell: "Vendre",
      profile_title: "Mon profil",
      profile_subtitle: "Vérifiez et mettez à jour vos informations personnelles.",
      profile_save: "Enregistrer les modifications",
      profile_updated: "Profil mis à jour.",
      kyc_title: "Complétez votre profil / KYC",
      kyc_subtitle: "Remplissez vos informations et choisissez une langue pour débloquer votre tableau de bord.",
      kyc_required_warning: "Tous les champs obligatoires doivent être remplis avant d'utiliser votre compte.",
      kyc_firstname: "Prénom",
      kyc_lastname: "Nom",
      kyc_phone: "Téléphone",
      kyc_gender: "Genre",
      kyc_gender_male: "Homme",
      kyc_gender_female: "Femme",
      kyc_gender_other: "Autre",
      kyc_gender_prefernotsay: "Préfère ne pas dire",
      kyc_dob: "Date de naissance",
      kyc_nationality: "Nationalité",
      kyc_occupation: "Profession",
      kyc_country: "Pays",
      kyc_address: "Adresse",
      kyc_city: "Ville",
      kyc_state: "État / Province",
      kyc_zip: "Code postal",
      kyc_language: "Langue préférée",
      kyc_submit: "Terminer la configuration",
      kyc_submitting: "Enregistrement…",
      kyc_success: "Configuration terminée. Votre tableau de bord a été traduit dans votre langue préférée.",
      kyc_required: "Ce champ est obligatoire",
      kyc_genericError: "Impossible d'enregistrer. Veuillez réessayer.",
      status_ACTIVE: "Actif",
      status_PENDING: "En attente",
      status_SUSPENDED: "Suspendu",
      status_COMPLETED: "Terminé",
      status_PROCESSING: "En cours",
      status_FAILED: "Échoué",
      th_title: "Historique des virements",
      th_from_to: "De / À",
      th_ref: "Référence",
      th_filterAll: "Tous",
      th_filterSent: "Envoyés",
      th_filterReceived: "Reçus",
      th_filterPending: "En attente",
      th_exportCsv: "Exporter CSV",
      th_search: "Rechercher des virements…",
      th_empty: "Aucun virement trouvé.",
      st_title: "Relevé de compte",
      st_period: "Période",
      st_from: "Du",
      st_to: "Au",
      st_downloadPdf: "Télécharger PDF",
      st_downloadCsv: "Télécharger CSV",
      st_openingBalance: "Solde initial",
      st_closingBalance: "Solde final",
      st_totalIn: "Total entrées",
      st_totalOut: "Total sorties",
      intl_title: "Virement international",
      intl_sendAmount: "Vous envoyez",
      intl_receiveAmount: "Le bénéficiaire reçoit",
      intl_fee: "Frais",
      intl_rate: "Taux de change",
      intl_eta: "Arrivée estimée",
      intl_recipientName: "Nom du bénéficiaire",
      intl_recipientAccount: "Compte / IBAN du bénéficiaire",
      intl_recipientBank: "Banque",
      intl_recipientSwift: "SWIFT / BIC",
      intl_recipientCountry: "Pays du bénéficiaire",
      intl_reference: "Référence",
      intl_submit: "Vérifier et envoyer",
      pin_title: "Code PIN du compte",
      pin_current: "PIN actuel",
      pin_new: "Nouveau PIN",
      pin_confirm: "Confirmer le nouveau PIN",
      pin_save: "Mettre à jour le PIN",
      pin_saved: "PIN mis à jour avec succès.",
      pw_title: "Changer le mot de passe",
      pw_current: "Mot de passe actuel",
      pw_new: "Nouveau mot de passe",
      pw_confirm: "Confirmer le nouveau mot de passe",
      pw_save: "Mettre à jour le mot de passe",
      pw_saved: "Mot de passe mis à jour avec succès.",
      card_title: "Ma carte",
      card_virtual: "Carte virtuelle",
      card_physical: "Carte physique",
      card_activate: "Activer",
      card_freeze: "Geler",
      card_cvv: "CVV",
      card_exp: "Expire",
      card_limit: "Plafond mensuel",
      mk_title: "Marchés",
      mk_topMovers: "Plus fortes variations",
      mk_watchlist: "Liste de suivi",
      mk_portfolio: "Mon portefeuille",
      mk_portfolioValue: "Valeur du portefeuille",
      mk_todaysGain: "Gain du jour",
      mk_totalGain: "Gain total",
      search: "Rechercher…",
      save: "Enregistrer",
      cancel: "Annuler",
      close: "Fermer",
      copy: "Copier",
      copied: "Copié !",
      submit: "Envoyer",
      continue: "Continuer",
      error_generic: "Une erreur est survenue. Veuillez réessayer.",
      error_unauthorized: "Votre session a expiré. Veuillez vous reconnecter.",
      logout_confirm: "Êtes-vous sûr de vouloir vous déconnecter ?",
      footer_rights: "Tous droits réservés.",
      common_required: "Requis"
    },
    de: {
      _name: "Deutsch",
      nav_dashboard: "Dashboard",
      nav_transferHistory: "Überweisungsverlauf",
      nav_statement: "Kontoauszug",
      nav_stocks: "Investieren / Aktien",
      nav_card: "Karten",
      nav_international: "Internationale Überweisung",
      nav_profile: "Mein Profil",
      nav_kyc: "KYC / Profil einrichten",
      nav_pin: "Konto-PIN",
      nav_password: "Passwort",
      nav_logout: "Abmelden",
      top_search: "Suchen…",
      hero_welcome: "Willkommen zurück",
      hero_accountNo: "Kontonummer",
      hero_status: "Status",
      hero_balance: "Verfügbares Guthaben",
      hero_viewDetails: "Details anzeigen",
      hero_viewStatement: "Kontoauszug anzeigen",
      actions_transfer: "Überweisen",
      actions_deposit: "Einzahlen",
      actions_withdraw: "Abheben",
      actions_bills: "Rechnungen zahlen",
      actions_card: "Karten",
      actions_invest: "Investieren",
      actions_loan: "Kredite",
      actions_support: "Support",
      actions_more: "Mehr",
      quick_balance: "Schnellübersicht",
      quick_today: "Heute",
      quick_week: "Diese Woche",
      quick_month: "Dieser Monat",
      quick_in: "Eingänge",
      quick_out: "Ausgänge",
      recent_title: "Letzte Transaktionen",
      recent_viewAll: "Alle anzeigen",
      recent_empty: "Noch keine Transaktionen.",
      recent_date: "Datum",
      recent_type: "Typ",
      recent_desc: "Beschreibung",
      recent_amount: "Betrag",
      recent_status: "Status",
      cards_title: "Meine Karten",
      cards_addCard: "Karte hinzufügen",
      stocks_title: "Märkte & Investitionen",
      stocks_price: "Preis",
      stocks_change: "Veränderung",
      stocks_buy: "Kaufen",
      stocks_sell: "Verkaufen",
      profile_title: "Mein Profil",
      profile_subtitle: "Überprüfen und aktualisieren Sie Ihre persönlichen Daten.",
      profile_save: "Änderungen speichern",
      profile_updated: "Profil aktualisiert.",
      kyc_title: "Profil / KYC vervollständigen",
      kyc_subtitle: "Füllen Sie Ihre Daten aus und wählen Sie eine Sprache, um Ihr Dashboard freizuschalten.",
      kyc_required_warning: "Alle Pflichtfelder müssen ausgefüllt sein, bevor Sie Ihr Konto nutzen können.",
      kyc_firstname: "Vorname",
      kyc_lastname: "Nachname",
      kyc_phone: "Telefonnummer",
      kyc_gender: "Geschlecht",
      kyc_gender_male: "Männlich",
      kyc_gender_female: "Weiblich",
      kyc_gender_other: "Divers",
      kyc_gender_prefernotsay: "Keine Angabe",
      kyc_dob: "Geburtsdatum",
      kyc_nationality: "Staatsangehörigkeit",
      kyc_occupation: "Beruf",
      kyc_country: "Land",
      kyc_address: "Adresse",
      kyc_city: "Stadt",
      kyc_state: "Bundesland",
      kyc_zip: "Postleitzahl",
      kyc_language: "Bevorzugte Sprache",
      kyc_submit: "Einrichtung abschließen",
      kyc_submitting: "Speichern…",
      kyc_success: "Einrichtung abgeschlossen. Ihr Dashboard wurde in Ihre bevorzugte Sprache übersetzt.",
      kyc_required: "Dieses Feld ist erforderlich",
      kyc_genericError: "Speichern fehlgeschlagen. Bitte erneut versuchen.",
      status_ACTIVE: "Aktiv",
      status_PENDING: "Ausstehend",
      status_SUSPENDED: "Gesperrt",
      status_COMPLETED: "Abgeschlossen",
      status_PROCESSING: "In Bearbeitung",
      status_FAILED: "Fehlgeschlagen",
      th_title: "Überweisungsverlauf",
      th_from_to: "Von / An",
      th_ref: "Referenz",
      th_filterAll: "Alle",
      th_filterSent: "Gesendet",
      th_filterReceived: "Empfangen",
      th_filterPending: "Ausstehend",
      th_exportCsv: "CSV exportieren",
      th_search: "Überweisungen suchen…",
      th_empty: "Keine Überweisungen gefunden.",
      st_title: "Kontoauszug",
      st_period: "Zeitraum",
      st_from: "Von",
      st_to: "Bis",
      st_downloadPdf: "PDF herunterladen",
      st_downloadCsv: "CSV herunterladen",
      st_openingBalance: "Anfangsguthaben",
      st_closingBalance: "Endguthaben",
      st_totalIn: "Eingänge gesamt",
      st_totalOut: "Ausgänge gesamt",
      intl_title: "Internationale Überweisung",
      intl_sendAmount: "Sie senden",
      intl_receiveAmount: "Empfänger erhält",
      intl_fee: "Gebühr",
      intl_rate: "Wechselkurs",
      intl_eta: "Voraussichtliche Ankunft",
      intl_recipientName: "Name des Empfängers",
      intl_recipientAccount: "Konto / IBAN des Empfängers",
      intl_recipientBank: "Bank",
      intl_recipientSwift: "SWIFT / BIC",
      intl_recipientCountry: "Land des Empfängers",
      intl_reference: "Verwendungszweck",
      intl_submit: "Prüfen & Senden",
      pin_title: "Konto-PIN",
      pin_current: "Aktuelle PIN",
      pin_new: "Neue PIN",
      pin_confirm: "Neue PIN bestätigen",
      pin_save: "PIN aktualisieren",
      pin_saved: "PIN erfolgreich aktualisiert.",
      pw_title: "Passwort ändern",
      pw_current: "Aktuelles Passwort",
      pw_new: "Neues Passwort",
      pw_confirm: "Neues Passwort bestätigen",
      pw_save: "Passwort aktualisieren",
      pw_saved: "Passwort erfolgreich aktualisiert.",
      card_title: "Meine Karte",
      card_virtual: "Virtuelle Karte",
      card_physical: "Physische Karte",
      card_activate: "Aktivieren",
      card_freeze: "Einfrieren",
      card_cvv: "CVV",
      card_exp: "Gültig bis",
      card_limit: "Monatliches Limit",
      mk_title: "Märkte",
      mk_topMovers: "Top-Bewegungen",
      mk_watchlist: "Beobachtungsliste",
      mk_portfolio: "Mein Portfolio",
      mk_portfolioValue: "Portfoliowert",
      mk_todaysGain: "Heutiger Gewinn",
      mk_totalGain: "Gesamtgewinn",
      search: "Suchen…",
      save: "Speichern",
      cancel: "Abbrechen",
      close: "Schließen",
      copy: "Kopieren",
      copied: "Kopiert!",
      submit: "Absenden",
      continue: "Weiter",
      error_generic: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
      error_unauthorized: "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
      logout_confirm: "Sind Sie sicher, dass Sie sich abmelden möchten?",
      footer_rights: "Alle Rechte vorbehalten.",
      common_required: "Pflichtfeld"
    },
    pt: {
      _name: "Português",
      nav_dashboard: "Painel",
      nav_transferHistory: "Histórico de Transferências",
      nav_statement: "Extrato",
      nav_stocks: "Investir / Ações",
      nav_card: "Cartões",
      nav_international: "Transferência Internacional",
      nav_profile: "Meu Perfil",
      nav_kyc: "KYC / Configurar Perfil",
      nav_pin: "PIN da Conta",
      nav_password: "Senha",
      nav_logout: "Sair",
      top_search: "Buscar…",
      hero_welcome: "Bem-vindo de volta",
      hero_accountNo: "N.º da Conta",
      hero_status: "Status",
      hero_balance: "Saldo Disponível",
      hero_viewDetails: "Ver Detalhes",
      hero_viewStatement: "Ver Extrato",
      actions_transfer: "Transferir",
      actions_deposit: "Depositar",
      actions_withdraw: "Sacar",
      actions_bills: "Pagar Contas",
      actions_card: "Cartões",
      actions_invest: "Investir",
      actions_loan: "Empréstimos",
      actions_support: "Suporte",
      actions_more: "Mais",
      quick_balance: "Saldo Rápido",
      quick_today: "Hoje",
      quick_week: "Esta Semana",
      quick_month: "Este Mês",
      quick_in: "Entradas",
      quick_out: "Saídas",
      recent_title: "Transações Recentes",
      recent_viewAll: "Ver Todas",
      recent_empty: "Nenhuma transação ainda.",
      recent_date: "Data",
      recent_type: "Tipo",
      recent_desc: "Descrição",
      recent_amount: "Valor",
      recent_status: "Status",
      cards_title: "Meus Cartões",
      cards_addCard: "Adicionar Cartão",
      stocks_title: "Mercados & Investimentos",
      stocks_price: "Preço",
      stocks_change: "Variação",
      stocks_buy: "Comprar",
      stocks_sell: "Vender",
      profile_title: "Meu Perfil",
      profile_subtitle: "Revise e atualize suas informações pessoais.",
      profile_save: "Salvar Alterações",
      profile_updated: "Perfil atualizado.",
      kyc_title: "Complete Seu Perfil / KYC",
      kyc_subtitle: "Preencha seus dados e escolha um idioma para desbloquear seu painel.",
      kyc_required_warning: "Todos os campos obrigatórios devem ser preenchidos antes de usar a conta.",
      kyc_firstname: "Nome",
      kyc_lastname: "Sobrenome",
      kyc_phone: "Telefone",
      kyc_gender: "Gênero",
      kyc_gender_male: "Masculino",
      kyc_gender_female: "Feminino",
      kyc_gender_other: "Outro",
      kyc_gender_prefernotsay: "Prefiro não dizer",
      kyc_dob: "Data de Nascimento",
      kyc_nationality: "Nacionalidade",
      kyc_occupation: "Ocupação",
      kyc_country: "País",
      kyc_address: "Endereço",
      kyc_city: "Cidade",
      kyc_state: "Estado",
      kyc_zip: "CEP",
      kyc_language: "Idioma Preferido",
      kyc_submit: "Concluir Configuração",
      kyc_submitting: "Salvando…",
      kyc_success: "Configuração concluída. Seu painel foi traduzido para o seu idioma preferido.",
      kyc_required: "Este campo é obrigatório",
      kyc_genericError: "Não foi possível salvar. Tente novamente.",
      status_ACTIVE: "Ativo",
      status_PENDING: "Pendente",
      status_SUSPENDED: "Suspenso",
      status_COMPLETED: "Concluído",
      status_PROCESSING: "Processando",
      status_FAILED: "Falhou",
      th_title: "Histórico de Transferências",
      th_from_to: "De / Para",
      th_ref: "Referência",
      th_filterAll: "Todos",
      th_filterSent: "Enviados",
      th_filterReceived: "Recebidos",
      th_filterPending: "Pendentes",
      th_exportCsv: "Exportar CSV",
      th_search: "Buscar transferências…",
      th_empty: "Nenhuma transferência encontrada.",
      st_title: "Extrato Bancário",
      st_period: "Período",
      st_from: "De",
      st_to: "Até",
      st_downloadPdf: "Baixar PDF",
      st_downloadCsv: "Baixar CSV",
      st_openingBalance: "Saldo Inicial",
      st_closingBalance: "Saldo Final",
      st_totalIn: "Total de Entradas",
      st_totalOut: "Total de Saídas",
      intl_title: "Transferência Internacional",
      intl_sendAmount: "Você Envia",
      intl_receiveAmount: "Beneficiário Recebe",
      intl_fee: "Taxa",
      intl_rate: "Taxa de Câmbio",
      intl_eta: "Chegada Estimada",
      intl_recipientName: "Nome do Beneficiário",
      intl_recipientAccount: "Conta / IBAN do Beneficiário",
      intl_recipientBank: "Banco",
      intl_recipientSwift: "SWIFT / BIC",
      intl_recipientCountry: "País do Beneficiário",
      intl_reference: "Referência",
      intl_submit: "Revisar e Enviar",
      pin_title: "PIN da Conta",
      pin_current: "PIN Atual",
      pin_new: "Novo PIN",
      pin_confirm: "Confirmar Novo PIN",
      pin_save: "Atualizar PIN",
      pin_saved: "PIN atualizado com sucesso.",
      pw_title: "Alterar Senha",
      pw_current: "Senha Atual",
      pw_new: "Nova Senha",
      pw_confirm: "Confirmar Nova Senha",
      pw_save: "Atualizar Senha",
      pw_saved: "Senha atualizada com sucesso.",
      card_title: "Meu Cartão",
      card_virtual: "Cartão Virtual",
      card_physical: "Cartão Físico",
      card_activate: "Ativar",
      card_freeze: "Congelar",
      card_cvv: "CVV",
      card_exp: "Vence",
      card_limit: "Limite Mensal",
      mk_title: "Mercados",
      mk_topMovers: "Maiores Movimentações",
      mk_watchlist: "Lista de Observação",
      mk_portfolio: "Meu Portfólio",
      mk_portfolioValue: "Valor do Portfólio",
      mk_todaysGain: "Ganho de Hoje",
      mk_totalGain: "Ganho Total",
      search: "Buscar…",
      save: "Salvar",
      cancel: "Cancelar",
      close: "Fechar",
      copy: "Copiar",
      copied: "Copiado!",
      submit: "Enviar",
      continue: "Continuar",
      error_generic: "Ocorreu um erro. Tente novamente.",
      error_unauthorized: "Sua sessão expirou. Por favor, faça login novamente.",
      logout_confirm: "Tem certeza que deseja sair?",
      footer_rights: "Todos os direitos reservados.",
      common_required: "Obrigatório"
    },
    ru: {
      _name: "Русский",
      nav_dashboard: "Главная",
      nav_transferHistory: "История переводов",
      nav_statement: "Выписка",
      nav_stocks: "Инвестиции / Акции",
      nav_card: "Карты",
      nav_international: "Международный перевод",
      nav_profile: "Мой профиль",
      nav_kyc: "KYC / Настройка профиля",
      nav_pin: "PIN-код",
      nav_password: "Пароль",
      nav_logout: "Выйти",
      top_search: "Поиск…",
      hero_welcome: "С возвращением",
      hero_accountNo: "Номер счёта",
      hero_status: "Статус",
      hero_balance: "Доступный остаток",
      hero_viewDetails: "Подробнее",
      hero_viewStatement: "Посмотреть выписку",
      actions_transfer: "Перевод",
      actions_deposit: "Пополнить",
      actions_withdraw: "Снять",
      actions_bills: "Оплатить счета",
      actions_card: "Карты",
      actions_invest: "Инвестировать",
      actions_loan: "Кредиты",
      actions_support: "Поддержка",
      actions_more: "Ещё",
      quick_balance: "Быстрый баланс",
      quick_today: "Сегодня",
      quick_week: "За неделю",
      quick_month: "За месяц",
      quick_in: "Приход",
      quick_out: "Расход",
      recent_title: "Последние операции",
      recent_viewAll: "Все операции",
      recent_empty: "Операций пока нет.",
      recent_date: "Дата",
      recent_type: "Тип",
      recent_desc: "Описание",
      recent_amount: "Сумма",
      recent_status: "Статус",
      cards_title: "Мои карты",
      cards_addCard: "Добавить карту",
      stocks_title: "Рынки и инвестиции",
      stocks_price: "Цена",
      stocks_change: "Изменение",
      stocks_buy: "Купить",
      stocks_sell: "Продать",
      profile_title: "Мой профиль",
      profile_subtitle: "Проверьте и обновите свои персональные данные.",
      profile_save: "Сохранить изменения",
      profile_updated: "Профиль обновлён.",
      kyc_title: "Заполните профиль / KYC",
      kyc_subtitle: "Введите данные и выберите язык, чтобы разблокировать личный кабинет.",
      kyc_required_warning: "Все обязательные поля должны быть заполнены перед использованием счёта.",
      kyc_firstname: "Имя",
      kyc_lastname: "Фамилия",
      kyc_phone: "Телефон",
      kyc_gender: "Пол",
      kyc_gender_male: "Мужской",
      kyc_gender_female: "Женский",
      kyc_gender_other: "Другой",
      kyc_gender_prefernotsay: "Не указано",
      kyc_dob: "Дата рождения",
      kyc_nationality: "Гражданство",
      kyc_occupation: "Профессия",
      kyc_country: "Страна",
      kyc_address: "Адрес",
      kyc_city: "Город",
      kyc_state: "Область / Регион",
      kyc_zip: "Почтовый индекс",
      kyc_language: "Предпочитаемый язык",
      kyc_submit: "Завершить настройку",
      kyc_submitting: "Сохранение…",
      kyc_success: "Настройка завершена. Интерфейс переключён на выбранный язык.",
      kyc_required: "Это поле обязательно для заполнения",
      kyc_genericError: "Не удалось сохранить. Попробуйте ещё раз.",
      status_ACTIVE: "Активен",
      status_PENDING: "В ожидании",
      status_SUSPENDED: "Заблокирован",
      status_COMPLETED: "Завершён",
      status_PROCESSING: "Обработка",
      status_FAILED: "Ошибка",
      th_title: "История переводов",
      th_from_to: "От / Кому",
      th_ref: "Референс",
      th_filterAll: "Все",
      th_filterSent: "Отправленные",
      th_filterReceived: "Полученные",
      th_filterPending: "В ожидании",
      th_exportCsv: "Экспорт CSV",
      th_search: "Поиск переводов…",
      th_empty: "Переводов не найдено.",
      st_title: "Выписка по счёту",
      st_period: "Период",
      st_from: "С",
      st_to: "По",
      st_downloadPdf: "Скачать PDF",
      st_downloadCsv: "Скачать CSV",
      st_openingBalance: "Входящий остаток",
      st_closingBalance: "Исходящий остаток",
      st_totalIn: "Всего приход",
      st_totalOut: "Всего расход",
      intl_title: "Международный перевод",
      intl_sendAmount: "Отправляете",
      intl_receiveAmount: "Получатель получит",
      intl_fee: "Комиссия",
      intl_rate: "Курс обмена",
      intl_eta: "Ориентировочное время",
      intl_recipientName: "Имя получателя",
      intl_recipientAccount: "Счёт / IBAN получателя",
      intl_recipientBank: "Банк",
      intl_recipientSwift: "SWIFT / BIC",
      intl_recipientCountry: "Страна получателя",
      intl_reference: "Назначение платежа",
      intl_submit: "Проверить и отправить",
      pin_title: "PIN-код счёта",
      pin_current: "Текущий PIN",
      pin_new: "Новый PIN",
      pin_confirm: "Повторите новый PIN",
      pin_save: "Обновить PIN",
      pin_saved: "PIN-код успешно обновлён.",
      pw_title: "Сменить пароль",
      pw_current: "Текущий пароль",
      pw_new: "Новый пароль",
      pw_confirm: "Повторите новый пароль",
      pw_save: "Обновить пароль",
      pw_saved: "Пароль успешно обновлён.",
      card_title: "Моя карта",
      card_virtual: "Виртуальная карта",
      card_physical: "Физическая карта",
      card_activate: "Активировать",
      card_freeze: "Заморозить",
      card_cvv: "CVV",
      card_exp: "Срок действия",
      card_limit: "Месячный лимит",
      mk_title: "Рынки",
      mk_topMovers: "Лидеры движения",
      mk_watchlist: "Избранное",
      mk_portfolio: "Мой портфель",
      mk_portfolioValue: "Стоимость портфеля",
      mk_todaysGain: "Дневной доход",
      mk_totalGain: "Общий доход",
      search: "Поиск…",
      save: "Сохранить",
      cancel: "Отмена",
      close: "Закрыть",
      copy: "Копировать",
      copied: "Скопировано!",
      submit: "Отправить",
      continue: "Продолжить",
      error_generic: "Что-то пошло не так. Попробуйте ещё раз.",
      error_unauthorized: "Сессия истекла. Пожалуйста, войдите снова.",
      logout_confirm: "Вы уверены, что хотите выйти?",
      footer_rights: "Все права защищены.",
      common_required: "Обязательно"
    },
    zh: {
      _name: "中文",
      nav_dashboard: "主页",
      nav_transferHistory: "转账记录",
      nav_statement: "账单",
      nav_stocks: "投资 / 股票",
      nav_card: "卡片",
      nav_international: "国际转账",
      nav_profile: "我的资料",
      nav_kyc: "实名认证 / 设置资料",
      nav_pin: "账户密码",
      nav_password: "登录密码",
      nav_logout: "退出",
      top_search: "搜索…",
      hero_welcome: "欢迎回来",
      hero_accountNo: "账号",
      hero_status: "状态",
      hero_balance: "可用余额",
      hero_viewDetails: "查看详情",
      hero_viewStatement: "查看账单",
      actions_transfer: "转账",
      actions_deposit: "存款",
      actions_withdraw: "取款",
      actions_bills: "缴费",
      actions_card: "卡片",
      actions_invest: "投资",
      actions_loan: "贷款",
      actions_support: "客服",
      actions_more: "更多",
      quick_balance: "快速余额",
      quick_today: "今日",
      quick_week: "本周",
      quick_month: "本月",
      quick_in: "收入",
      quick_out: "支出",
      recent_title: "最近交易",
      recent_viewAll: "查看全部",
      recent_empty: "暂无交易记录。",
      recent_date: "日期",
      recent_type: "类型",
      recent_desc: "说明",
      recent_amount: "金额",
      recent_status: "状态",
      cards_title: "我的卡片",
      cards_addCard: "添加卡片",
      stocks_title: "市场与投资",
      stocks_price: "价格",
      stocks_change: "涨跌",
      stocks_buy: "买入",
      stocks_sell: "卖出",
      profile_title: "我的资料",
      profile_subtitle: "查看并更新您的个人信息。",
      profile_save: "保存更改",
      profile_updated: "资料已更新。",
      kyc_title: "完善个人资料 / KYC",
      kyc_subtitle: "请填写您的信息并选择语言，以解锁您的仪表盘。",
      kyc_required_warning: "使用账户前必须完成所有必填字段。",
      kyc_firstname: "名",
      kyc_lastname: "姓",
      kyc_phone: "手机号",
      kyc_gender: "性别",
      kyc_gender_male: "男",
      kyc_gender_female: "女",
      kyc_gender_other: "其他",
      kyc_gender_prefernotsay: "不愿透露",
      kyc_dob: "出生日期",
      kyc_nationality: "国籍",
      kyc_occupation: "职业",
      kyc_country: "国家",
      kyc_address: "街道地址",
      kyc_city: "城市",
      kyc_state: "省 / 州",
      kyc_zip: "邮编",
      kyc_language: "首选语言",
      kyc_submit: "完成设置",
      kyc_submitting: "保存中…",
      kyc_success: "设置完成。您的仪表盘已切换到您选择的语言。",
      kyc_required: "此字段为必填项",
      kyc_genericError: "保存失败，请重试。",
      status_ACTIVE: "正常",
      status_PENDING: "待处理",
      status_SUSPENDED: "已冻结",
      status_COMPLETED: "已完成",
      status_PROCESSING: "处理中",
      status_FAILED: "失败",
      th_title: "转账记录",
      th_from_to: "转账方 / 收款方",
      th_ref: "参考号",
      th_filterAll: "全部",
      th_filterSent: "已转出",
      th_filterReceived: "已收到",
      th_filterPending: "待处理",
      th_exportCsv: "导出 CSV",
      th_search: "搜索转账…",
      th_empty: "未找到转账记录。",
      st_title: "账户账单",
      st_period: "周期",
      st_from: "起始",
      st_to: "结束",
      st_downloadPdf: "下载 PDF",
      st_downloadCsv: "下载 CSV",
      st_openingBalance: "期初余额",
      st_closingBalance: "期末余额",
      st_totalIn: "总收入",
      st_totalOut: "总支出",
      intl_title: "国际转账",
      intl_sendAmount: "转出金额",
      intl_receiveAmount: "收款金额",
      intl_fee: "手续费",
      intl_rate: "汇率",
      intl_eta: "预计到账",
      intl_recipientName: "收款人姓名",
      intl_recipientAccount: "收款账户 / IBAN",
      intl_recipientBank: "银行名称",
      intl_recipientSwift: "SWIFT / BIC",
      intl_recipientCountry: "收款人国家",
      intl_reference: "备注",
      intl_submit: "检查并发送",
      pin_title: "账户 PIN",
      pin_current: "当前 PIN",
      pin_new: "新 PIN",
      pin_confirm: "确认新 PIN",
      pin_save: "更新 PIN",
      pin_saved: "PIN 更新成功。",
      pw_title: "修改登录密码",
      pw_current: "当前密码",
      pw_new: "新密码",
      pw_confirm: "确认新密码",
      pw_save: "更新密码",
      pw_saved: "密码更新成功。",
      card_title: "我的卡片",
      card_virtual: "虚拟卡",
      card_physical: "实体卡",
      card_activate: "激活",
      card_freeze: "冻结",
      card_cvv: "CVV",
      card_exp: "有效期",
      card_limit: "每月限额",
      mk_title: "市场",
      mk_topMovers: "热门涨跌",
      mk_watchlist: "自选",
      mk_portfolio: "我的投资",
      mk_portfolioValue: "投资市值",
      mk_todaysGain: "今日盈亏",
      mk_totalGain: "总盈亏",
      search: "搜索…",
      save: "保存",
      cancel: "取消",
      close: "关闭",
      copy: "复制",
      copied: "已复制！",
      submit: "提交",
      continue: "继续",
      error_generic: "出错了，请重试。",
      error_unauthorized: "登录已过期，请重新登录。",
      logout_confirm: "确认退出登录？",
      footer_rights: "版权所有。",
      common_required: "必填"
    },
    ar: {
      _name: "العربية",
      nav_dashboard: "الصفحة الرئيسية",
      nav_transferHistory: "سجل التحويلات",
      nav_statement: "كشف الحساب",
      nav_stocks: "الاستثمار / الأسهم",
      nav_card: "البطاقات",
      nav_international: "تحويل دولي",
      nav_profile: "ملفي الشخصي",
      nav_kyc: "بيانات التعرف على العملاء",
      nav_pin: "رقم الحساب السري",
      nav_password: "كلمة المرور",
      nav_logout: "تسجيل الخروج",
      top_search: "بحث…",
      hero_welcome: "أهلاً بعودتك",
      hero_accountNo: "رقم الحساب",
      hero_status: "الحالة",
      hero_balance: "الرصيد المتاح",
      hero_viewDetails: "عرض التفاصيل",
      hero_viewStatement: "عرض الكشف",
      actions_transfer: "تحويل",
      actions_deposit: "إيداع",
      actions_withdraw: "سحب",
      actions_bills: "دفع الفواتير",
      actions_card: "البطاقات",
      actions_invest: "استثمار",
      actions_loan: "قروض",
      actions_support: "الدعم",
      actions_more: "المزيد",
      quick_balance: "رصيد سريع",
      quick_today: "اليوم",
      quick_week: "هذا الأسبوع",
      quick_month: "هذا الشهر",
      quick_in: "وارد",
      quick_out: "صادر",
      recent_title: "آخر المعاملات",
      recent_viewAll: "عرض الكل",
      recent_empty: "لا توجد معاملات بعد.",
      recent_date: "التاريخ",
      recent_type: "النوع",
      recent_desc: "الوصف",
      recent_amount: "المبلغ",
      recent_status: "الحالة",
      cards_title: "بطاقاتي",
      cards_addCard: "إضافة بطاقة",
      stocks_title: "الأسواق والاستثمار",
      stocks_price: "السعر",
      stocks_change: "التغير",
      stocks_buy: "شراء",
      stocks_sell: "بيع",
      profile_title: "ملفي الشخصي",
      profile_subtitle: "راجع وقم بتحديث معلوماتك الشخصية.",
      profile_save: "حفظ التغييرات",
      profile_updated: "تم تحديث الملف الشخصي.",
      kyc_title: "أكمل ملفك الشخصي / KYC",
      kyc_subtitle: "الرجاء ملء بياناتك واختيار لغة لفتح لوحة التحكم الخاصة بك.",
      kyc_required_warning: "يجب إكمال جميع الحقول المطلوبة قبل استخدام حسابك.",
      kyc_firstname: "الاسم الأول",
      kyc_lastname: "اسم العائلة",
      kyc_phone: "رقم الهاتف",
      kyc_gender: "الجنس",
      kyc_gender_male: "ذكر",
      kyc_gender_female: "أنثى",
      kyc_gender_other: "آخر",
      kyc_gender_prefernotsay: "أفضل عدم الإشارة",
      kyc_dob: "تاريخ الميلاد",
      kyc_nationality: "الجنسية",
      kyc_occupation: "المهنة",
      kyc_country: "البلد",
      kyc_address: "العنوان",
      kyc_city: "المدينة",
      kyc_state: "المنطقة / المحافظة",
      kyc_zip: "الرمز البريدي",
      kyc_language: "اللغة المفضلة",
      kyc_submit: "إكمال الإعداد",
      kyc_submitting: "جارٍ الحفظ…",
      kyc_success: "اكتمل الإعداد. تمت ترجمة لوحة التحكم إلى لغتك المفضلة.",
      kyc_required: "هذا الحقل مطلوب",
      kyc_genericError: "تعذر الحفظ. يرجى المحاولة مرة أخرى.",
      status_ACTIVE: "نشط",
      status_PENDING: "قيد الانتظار",
      status_SUSPENDED: "موقوف",
      status_COMPLETED: "مكتمل",
      status_PROCESSING: "قيد المعالجة",
      status_FAILED: "فشل",
      th_title: "سجل التحويلات",
      th_from_to: "من / إلى",
      th_ref: "المرجع",
      th_filterAll: "الكل",
      th_filterSent: "مرسلة",
      th_filterReceived: "مستلمة",
      th_filterPending: "قيد الانتظار",
      th_exportCsv: "تصدير CSV",
      th_search: "البحث عن التحويلات…",
      th_empty: "لم يتم العثور على تحويلات.",
      st_title: "كشف حساب",
      st_period: "الفترة",
      st_from: "من",
      st_to: "إلى",
      st_downloadPdf: "تحميل PDF",
      st_downloadCsv: "تحميل CSV",
      st_openingBalance: "الرصيد الافتتاحي",
      st_closingBalance: "الرصيد الختامي",
      st_totalIn: "إجمالي الوارد",
      st_totalOut: "إجمالي الصادر",
      intl_title: "تحويل دولي",
      intl_sendAmount: "المبلغ المرسل",
      intl_receiveAmount: "المبلغ المستلم",
      intl_fee: "الرسوم",
      intl_rate: "سعر الصرف",
      intl_eta: "موعد الوصول المتوقع",
      intl_recipientName: "اسم المستلم",
      intl_recipientAccount: "حساب المستلم / IBAN",
      intl_recipientBank: "اسم البنك",
      intl_recipientSwift: "SWIFT / BIC",
      intl_recipientCountry: "بلد المستلم",
      intl_reference: "مرجع الدفع",
      intl_submit: "مراجعة وإرسال",
      pin_title: "رقم الحساب السري",
      pin_current: "الرقم السري الحالي",
      pin_new: "الرقم السري الجديد",
      pin_confirm: "تأكيد الرقم الجديد",
      pin_save: "تحديث الرقم السري",
      pin_saved: "تم تحديث الرقم السري بنجاح.",
      pw_title: "تغيير كلمة المرور",
      pw_current: "كلمة المرور الحالية",
      pw_new: "كلمة المرور الجديدة",
      pw_confirm: "تأكيد كلمة المرور الجديدة",
      pw_save: "تحديث كلمة المرور",
      pw_saved: "تم تحديث كلمة المرور بنجاح.",
      card_title: "بطاقتي",
      card_virtual: "بطاقة افتراضية",
      card_physical: "بطاقة مادية",
      card_activate: "تفعيل",
      card_freeze: "تجميد",
      card_cvv: "CVV",
      card_exp: "تنتهي في",
      card_limit: "الحد الشهري",
      mk_title: "الأسواق",
      mk_topMovers: "أكثر الحركة",
      mk_watchlist: "المتابعة",
      mk_portfolio: "محفظتي",
      mk_portfolioValue: "قيمة المحفظة",
      mk_todaysGain: "ربح اليوم",
      mk_totalGain: "إجمالي الربح",
      search: "بحث…",
      save: "حفظ",
      cancel: "إلغاء",
      close: "إغلاق",
      copy: "نسخ",
      copied: "تم النسخ!",
      submit: "إرسال",
      continue: "متابعة",
      error_generic: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      error_unauthorized: "انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.",
      logout_confirm: "هل أنت متأكد من تسجيل الخروج؟",
      footer_rights: "جميع الحقوق محفوظة.",
      common_required: "مطلوب"
    }
  };

  const COUNTRY_LANGS = {
    AF: { primary: "fa", langs: ["fa", "en"] },
    AL: { primary: "en", langs: ["en", "it", "el"] },
    DZ: { primary: "ar", langs: ["ar", "fr"] },
    AO: { primary: "pt", langs: ["pt"] },
    AR: { primary: "es", langs: ["es", "en"] },
    AM: { primary: "en", langs: ["en", "ar"] },
    AU: { primary: "en", langs: ["en"] },
    AT: { primary: "de", langs: ["de", "en"] },
    AZ: { primary: "ru", langs: ["ru", "en", "ar"] },
    BH: { primary: "ar", langs: ["ar", "en"] },
    BD: { primary: "en", langs: ["en"] },
    BB: { primary: "en", langs: ["en"] },
    BY: { primary: "ru", langs: ["ru"] },
    BE: { primary: "fr", langs: ["fr", "nl", "de", "en"] },
    BZ: { primary: "en", langs: ["en", "es"] },
    BJ: { primary: "fr", langs: ["fr"] },
    BT: { primary: "en", langs: ["en"] },
    BO: { primary: "es", langs: ["es"] },
    BA: { primary: "en", langs: ["en"] },
    BW: { primary: "en", langs: ["en"] },
    BR: { primary: "pt", langs: ["pt", "es", "en"] },
    BN: { primary: "en", langs: ["en", "zh"] },
    BG: { primary: "ru", langs: ["ru", "en"] },
    BF: { primary: "fr", langs: ["fr"] },
    BI: { primary: "fr", langs: ["fr", "en"] },
    KH: { primary: "en", langs: ["en", "zh"] },
    CM: { primary: "fr", langs: ["fr", "en"] },
    CA: { primary: "en", langs: ["en", "fr"] },
    CV: { primary: "pt", langs: ["pt"] },
    CF: { primary: "fr", langs: ["fr"] },
    TD: { primary: "fr", langs: ["fr", "ar"] },
    CL: { primary: "es", langs: ["es", "en"] },
    CN: { primary: "zh", langs: ["zh", "en"] },
    CO: { primary: "es", langs: ["es", "en"] },
    KM: { primary: "fr", langs: ["fr", "ar"] },
    CG: { primary: "fr", langs: ["fr"] },
    CD: { primary: "fr", langs: ["fr"] },
    CR: { primary: "es", langs: ["es", "en"] },
    CI: { primary: "fr", langs: ["fr", "en"] },
    HR: { primary: "en", langs: ["en", "de"] },
    CU: { primary: "es", langs: ["es"] },
    CY: { primary: "en", langs: ["en", "el"] },
    CZ: { primary: "de", langs: ["de", "en"] },
    DK: { primary: "en", langs: ["en", "de"] },
    DJ: { primary: "fr", langs: ["fr", "ar"] },
    DM: { primary: "en", langs: ["en"] },
    DO: { primary: "es", langs: ["es", "en"] },
    EC: { primary: "es", langs: ["es", "en"] },
    EG: { primary: "ar", langs: ["ar", "en", "fr"] },
    SV: { primary: "es", langs: ["es", "en"] },
    GQ: { primary: "es", langs: ["es", "fr"] },
    ER: { primary: "en", langs: ["en", "ar"] },
    EE: { primary: "ru", langs: ["ru", "en"] },
    SZ: { primary: "en", langs: ["en"] },
    ET: { primary: "en", langs: ["en", "ar"] },
    FJ: { primary: "en", langs: ["en"] },
    FI: { primary: "en", langs: ["en", "de", "ru"] },
    FR: { primary: "fr", langs: ["fr", "en", "es", "de", "ar"] },
    GA: { primary: "fr", langs: ["fr"] },
    GM: { primary: "en", langs: ["en"] },
    GE: { primary: "ru", langs: ["ru", "en"] },
    DE: { primary: "de", langs: ["de", "en", "fr", "ru"] },
    GH: { primary: "en", langs: ["en", "fr"] },
    GR: { primary: "en", langs: ["en", "de", "fr"] },
    GD: { primary: "en", langs: ["en"] },
    GT: { primary: "es", langs: ["es", "en"] },
    GN: { primary: "fr", langs: ["fr"] },
    GW: { primary: "pt", langs: ["pt"] },
    GY: { primary: "en", langs: ["en"] },
    HT: { primary: "fr", langs: ["fr", "en"] },
    HN: { primary: "es", langs: ["es", "en"] },
    HK: { primary: "zh", langs: ["zh", "en"] },
    HU: { primary: "de", langs: ["de", "en", "ru"] },
    IS: { primary: "en", langs: ["en"] },
    IN: { primary: "en", langs: ["en", "zh", "ar"] },
    ID: { primary: "en", langs: ["en", "zh"] },
    IR: { primary: "ar", langs: ["ar", "en"] },
    IQ: { primary: "ar", langs: ["ar", "en"] },
    IE: { primary: "en", langs: ["en"] },
    IL: { primary: "en", langs: ["en", "ar", "ru"] },
    IT: { primary: "en", langs: ["en", "fr", "de", "es"] },
    JM: { primary: "en", langs: ["en"] },
    JP: { primary: "en", langs: ["en", "zh"] },
    JO: { primary: "ar", langs: ["ar", "en"] },
    KZ: { primary: "ru", langs: ["ru", "en", "zh"] },
    KE: { primary: "en", langs: ["en", "sw", "ar"] },
    KI: { primary: "en", langs: ["en"] },
    KW: { primary: "ar", langs: ["ar", "en"] },
    KG: { primary: "ru", langs: ["ru", "en"] },
    LA: { primary: "en", langs: ["en", "zh"] },
    LV: { primary: "ru", langs: ["ru", "en", "de"] },
    LB: { primary: "ar", langs: ["ar", "fr", "en"] },
    LS: { primary: "en", langs: ["en"] },
    LR: { primary: "en", langs: ["en"] },
    LY: { primary: "ar", langs: ["ar", "en"] },
    LI: { primary: "de", langs: ["de", "en"] },
    LT: { primary: "ru", langs: ["ru", "en"] },
    LU: { primary: "fr", langs: ["fr", "de", "en"] },
    MO: { primary: "zh", langs: ["zh", "pt", "en"] },
    MG: { primary: "fr", langs: ["fr", "en"] },
    MW: { primary: "en", langs: ["en"] },
    MY: { primary: "en", langs: ["en", "zh"] },
    MV: { primary: "en", langs: ["en"] },
    ML: { primary: "fr", langs: ["fr"] },
    MT: { primary: "en", langs: ["en", "it"] },
    MH: { primary: "en", langs: ["en"] },
    MR: { primary: "ar", langs: ["ar", "fr"] },
    MU: { primary: "en", langs: ["en", "fr"] },
    MX: { primary: "es", langs: ["es", "en"] },
    FM: { primary: "en", langs: ["en"] },
    MD: { primary: "ru", langs: ["ru", "en"] },
    MC: { primary: "fr", langs: ["fr", "en"] },
    MN: { primary: "zh", langs: ["zh", "en", "ru"] },
    ME: { primary: "en", langs: ["en"] },
    MA: { primary: "ar", langs: ["ar", "fr", "en"] },
    MZ: { primary: "pt", langs: ["pt", "en"] },
    MM: { primary: "en", langs: ["en", "zh"] },
    NA: { primary: "en", langs: ["en"] },
    NR: { primary: "en", langs: ["en"] },
    NP: { primary: "en", langs: ["en"] },
    NL: { primary: "en", langs: ["en", "de", "fr"] },
    NZ: { primary: "en", langs: ["en"] },
    NI: { primary: "es", langs: ["es", "en"] },
    NE: { primary: "fr", langs: ["fr"] },
    NG: { primary: "en", langs: ["en", "fr", "ar", "pt"] },
    KP: { primary: "zh", langs: ["zh", "en", "ru"] },
    MK: { primary: "en", langs: ["en"] },
    NO: { primary: "en", langs: ["en", "de"] },
    OM: { primary: "ar", langs: ["ar", "en"] },
    PK: { primary: "en", langs: ["en", "ar"] },
    PW: { primary: "en", langs: ["en"] },
    PS: { primary: "ar", langs: ["ar", "en"] },
    PA: { primary: "es", langs: ["es", "en"] },
    PG: { primary: "en", langs: ["en"] },
    PY: { primary: "es", langs: ["es", "pt"] },
    PE: { primary: "es", langs: ["es", "en"] },
    PH: { primary: "en", langs: ["en", "zh"] },
    PL: { primary: "de", langs: ["de", "en", "ru"] },
    PT: { primary: "pt", langs: ["pt", "en", "es", "fr"] },
    QA: { primary: "ar", langs: ["ar", "en"] },
    RO: { primary: "en", langs: ["en", "ru", "de"] },
    RU: { primary: "ru", langs: ["ru", "en", "zh", "de", "ar"] },
    RW: { primary: "fr", langs: ["fr", "en"] },
    KN: { primary: "en", langs: ["en"] },
    LC: { primary: "en", langs: ["en"] },
    VC: { primary: "en", langs: ["en"] },
    WS: { primary: "en", langs: ["en"] },
    SM: { primary: "it", langs: ["it", "en"] },
    ST: { primary: "pt", langs: ["pt"] },
    SA: { primary: "ar", langs: ["ar", "en"] },
    SN: { primary: "fr", langs: ["fr", "en"] },
    RS: { primary: "ru", langs: ["ru", "en"] },
    SC: { primary: "en", langs: ["en", "fr"] },
    SL: { primary: "en", langs: ["en"] },
    SG: { primary: "en", langs: ["en", "zh", "ms"] },
    SK: { primary: "de", langs: ["de", "en", "ru"] },
    SI: { primary: "en", langs: ["en", "de"] },
    SB: { primary: "en", langs: ["en"] },
    SO: { primary: "en", langs: ["en", "ar"] },
    ZA: { primary: "en", langs: ["en", "af"] },
    KR: { primary: "en", langs: ["en", "zh"] },
    SS: { primary: "en", langs: ["en", "ar"] },
    ES: { primary: "es", langs: ["es", "en", "fr", "pt", "ar"] },
    LK: { primary: "en", langs: ["en"] },
    SD: { primary: "ar", langs: ["ar", "en"] },
    SR: { primary: "nl", langs: ["nl", "en"] },
    SE: { primary: "en", langs: ["en", "de"] },
    CH: { primary: "de", langs: ["de", "fr", "it", "en"] },
    SY: { primary: "ar", langs: ["ar", "en"] },
    TW: { primary: "zh", langs: ["zh", "en"] },
    TJ: { primary: "ru", langs: ["ru", "en"] },
    TZ: { primary: "en", langs: ["en", "sw"] },
    TH: { primary: "en", langs: ["en", "zh"] },
    TG: { primary: "fr", langs: ["fr"] },
    TO: { primary: "en", langs: ["en"] },
    TT: { primary: "en", langs: ["en"] },
    TN: { primary: "ar", langs: ["ar", "fr", "en"] },
    TR: { primary: "en", langs: ["en", "ar", "ru"] },
    TM: { primary: "ru", langs: ["ru", "en"] },
    TV: { primary: "en", langs: ["en"] },
    UG: { primary: "en", langs: ["en", "sw"] },
    UA: { primary: "ru", langs: ["ru", "en"] },
    AE: { primary: "ar", langs: ["ar", "en"] },
    GB: { primary: "en", langs: ["en", "fr", "de", "es", "pt", "ru", "ar", "zh"] },
    US: { primary: "en", langs: ["en", "es", "fr", "zh", "ar", "pt", "ru"] },
    UY: { primary: "es", langs: ["es", "pt", "en"] },
    UZ: { primary: "ru", langs: ["ru", "en"] },
    VU: { primary: "en", langs: ["en", "fr"] },
    VA: { primary: "it", langs: ["it", "en", "fr", "es"] },
    VE: { primary: "es", langs: ["es", "en"] },
    VN: { primary: "en", langs: ["en", "zh"] },
    YE: { primary: "ar", langs: ["ar", "en"] },
    ZM: { primary: "en", langs: ["en"] },
    ZW: { primary: "en", langs: ["en"] }
  };

  function dictForCode(code) {
    const want = String(code || "en").toLowerCase();
    if (DICT[want]) return DICT[want];
    const base = want.split("-")[0];
    if (DICT[base]) return DICT[base];
    return DICT.en;
  }

  function t(code, key, vars) {
    const dict = dictForCode(code);
    const entry = dict && dict[key];
    let str = typeof entry === "string" ? entry : (DICT.en && DICT.en[key] ? DICT.en[key] : String(key));
    if (vars && typeof vars === "object") {
      for (const k of Object.keys(vars)) {
        const re = new RegExp(`\\{\\{${k}\\}\\}`, "g");
        str = String(str).replace(re, String(vars[k]));
      }
    }
    return str;
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function applyLanguageToDocument(code, rootEl) {
    const dict = dictForCode(code);
    const scope = rootEl || (typeof document !== "undefined" ? document : null);
    if (!scope || typeof scope.querySelectorAll !== "function") return;
    const root = scope.documentElement || scope;
    if (root && "setAttribute" in root) {
      root.setAttribute("lang", code);
      if (code === "ar") {
        root.setAttribute("dir", "rtl");
      } else {
        root.setAttribute("dir", "ltr");
      }
    }
    scope.querySelectorAll && scope.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const vars = el.getAttribute("data-i18n-vars");
      let varsObj = null;
      if (vars) {
        try { varsObj = JSON.parse(vars); } catch (_) { varsObj = null; }
      }
      const entry = (dict && dict[key]) ? dict[key] : (DICT.en[key] || key);
      let str = typeof entry === "string" ? entry : String(key);
      if (varsObj) {
        for (const k of Object.keys(varsObj)) {
          str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(varsObj[k]));
        }
      }
      el.textContent = str;
    });
    scope.querySelectorAll && scope.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key || !("setAttribute" in el)) return;
      const entry = (dict && dict[key]) ? dict[key] : (DICT.en[key] || key);
      el.setAttribute("placeholder", String(entry));
    });
    scope.querySelectorAll && scope.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key || !("setAttribute" in el)) return;
      const entry = (dict && dict[key]) ? dict[key] : (DICT.en[key] || key);
      el.setAttribute("title", String(entry));
    });
    scope.querySelectorAll && scope.querySelectorAll("[data-i18n-value]").forEach((el) => {
      const key = el.getAttribute("data-i18n-value");
      if (!key || !("setAttribute" in el)) return;
      const entry = (dict && dict[key]) ? dict[key] : (DICT.en[key] || key);
      el.setAttribute("value", String(entry));
    });
    scope.querySelectorAll && scope.querySelectorAll("[data-i18n-status]").forEach((el) => {
      const status = String(el.getAttribute("data-i18n-status") || "").trim().toUpperCase();
      if (!status) return;
      const key = "status_" + status;
      const entry = (dict && dict[key]) ? dict[key] : (DICT.en[key] || status);
      el.textContent = entry;
    });
  }

  function getCountryLanguages(countryCodeOrName) {
    if (!countryCodeOrName) return { primary: "en", langs: ["en", "es", "fr", "de", "pt", "ru", "zh", "ar"] };
    const key = String(countryCodeOrName).trim().toUpperCase();
    if (COUNTRY_LANGS[key]) return COUNTRY_LANGS[key];
    const countryLanguages = Object.values(COUNTRY_LANGS);
    for (const row of countryLanguages) {
      if (String(countryCodeOrName).toLowerCase() === String(row?.name || "").toLowerCase()) return row;
    }
    return { primary: "en", langs: ["en", "es", "fr", "de", "pt", "ru", "zh", "ar"] };
  }

  function languageName(code) {
    const d = dictForCode(code);
    return d?._name || String(code || "");
  }

  function availableDictionaryLanguages() {
    const out = [];
    for (const key of Object.keys(DICT)) {
      if (key.length > 2 && DICT[key.slice(0, 2)]) continue;
      out.push({ code: key, name: DICT[key]._name });
    }
    return out;
  }

  async function fetchJson(url, options) {
    const res = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(((options || {}).headers) || {}) },
      ...(options || {})
    });
    let data = null;
    try { data = await res.json(); } catch (_) { data = null; }
    if (!res.ok) {
      const msg = String((data && data.error) ? data.error : (res.statusText || "Request failed"));
      if (res.status === 401) {
        throw new Error(msg || VT.I18N.t("en", "error_unauthorized"));
      }
      throw new Error(msg);
    }
    return data;
  }

  function api(path, options) { return fetchJson(path, options); }

  function toastMessage(message, kind) {
    let bar = typeof document !== "undefined" ? document.getElementById("vtI18nToast") : null;
    if (typeof document !== "undefined" && !bar) {
      bar = document.createElement("div");
      bar.id = "vtI18nToast";
      Object.assign(bar.style, {
        position: "fixed",
        top: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "9999",
        padding: "10px 14px",
        borderRadius: "12px",
        background: kind === "error" ? "rgba(127,29,29,0.92)" : kind === "warn" ? "rgba(146,64,14,0.92)" : "rgba(22,101,52,0.92)",
        color: "#fff",
        fontWeight: "700",
        fontSize: "13px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        maxWidth: "92vw"
      });
      document.body.appendChild(bar);
    }
    if (bar) {
      bar.textContent = String(message || "");
      bar.style.display = "block";
      clearTimeout(bar._vtTid);
      bar._vtTid = setTimeout(() => { bar.style.display = "none"; }, 3000);
    }
  }

  function ensureKycGateCss() {
    if (typeof document === "undefined") return;
    if (document.getElementById("vtKycGateCss")) return;
    const el = document.createElement("style");
    el.id = "vtKycGateCss";
    el.textContent = `
      #vtKycGate {
        position: fixed;
        inset: 0;
        z-index: 2147483000;
        background: radial-gradient(circle at top, rgba(212,175,55,0.14), transparent 30%),
          linear-gradient(180deg, #070b10, #0b0f14);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      #vtKycGate .k-shell { max-width: 920px; margin: 0 auto; padding: 24px; }
      #vtKycGate .k-brand { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
      #vtKycGate .k-brand img { height: 36px; max-width: 220px; }
      #vtKycGate .k-head {
        background: rgba(15,23,42,0.7);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 18px;
        padding: 18px 18px 16px;
        margin-bottom: 14px;
      }
      #vtKycGate .k-head h1 { margin: 0 0 6px; font-size: 22px; color: #f8fafc; }
      #vtKycGate .k-head p { margin: 0; color: #94a3b8; font-size: 13px; }
      #vtKycGate .k-warn {
        background: rgba(146,64,14,0.12);
        border: 1px solid rgba(251,191,36,0.32);
        color: #fde68a;
        padding: 10px 12px;
        border-radius: 14px;
        font-size: 13px;
        margin-bottom: 14px;
      }
      #vtKycGate .k-card {
        background: rgba(15,23,42,0.7);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 18px;
        padding: 18px;
      }
      #vtKycGate .k-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      #vtKycGate .k-full { grid-column: 1 / -1; }
      #vtKycGate label {
        display: block;
        font-size: 12px;
        color: #cbd5e1;
        font-weight: 800;
        margin: 0 0 6px;
      }
      #vtKycGate label .req { color: #fca5a5; margin-left: 4px; }
      #vtKycGate input, #vtKycGate select {
        width: 100%;
        padding: 12px 12px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.04);
        color: #f8fafc;
        font-size: 14px;
        outline: none;
      }
      #vtKycGate input:focus, #vtKycGate select:focus {
        border-color: rgba(212,175,55,0.75);
        box-shadow: 0 0 0 3px rgba(212,175,55,0.18);
      }
      #vtKycGate .k-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 16px;
        flex-wrap: wrap;
      }
      #vtKycGate .k-btn {
        border: 0;
        border-radius: 14px;
        padding: 12px 16px;
        font-weight: 800;
        cursor: pointer;
        font-size: 14px;
      }
      #vtKycGate .k-btn.primary {
        background: linear-gradient(135deg, #d4af37, #f5d87a);
        color: #0b0f14;
      }
      #vtKycGate .k-btn.primary:disabled { opacity: 0.7; cursor: progress; }
      #vtKycGate .k-btn.secondary {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.08);
        color: #f8fafc;
      }
      #vtKycGate .k-foot { margin-top: 18px; text-align: center; color: #94a3b8; font-size: 12px; }
      #vtKycGate .k-err {
        font-size: 12px;
        color: #fecaca;
        margin-top: 4px;
      }
      @media (max-width: 880px) {
        #vtKycGate .k-grid { grid-template-columns: 1fr; }
        #vtKycGate .k-shell { padding: 14px; }
        #vtKycGate .k-head h1 { font-size: 19px; }
      }
    `;
    document.head.appendChild(el);
  }

  function countryOptions() {
    return [
      { code: "US", name: "United States" },
      { code: "GB", name: "United Kingdom" },
      { code: "CA", name: "Canada" },
      { code: "AU", name: "Australia" },
      { code: "NG", name: "Nigeria" },
      { code: "GH", name: "Ghana" },
      { code: "KE", name: "Kenya" },
      { code: "ZA", name: "South Africa" },
      { code: "EG", name: "Egypt" },
      { code: "MA", name: "Morocco" },
      { code: "SA", name: "Saudi Arabia" },
      { code: "AE", name: "UAE" },
      { code: "QA", name: "Qatar" },
      { code: "KW", name: "Kuwait" },
      { code: "BH", name: "Bahrain" },
      { code: "JO", name: "Jordan" },
      { code: "LB", name: "Lebanon" },
      { code: "FR", name: "France" },
      { code: "DE", name: "Germany" },
      { code: "ES", name: "Spain" },
      { code: "IT", name: "Italy" },
      { code: "PT", name: "Portugal" },
      { code: "NL", name: "Netherlands" },
      { code: "BE", name: "Belgium" },
      { code: "CH", name: "Switzerland" },
      { code: "SE", name: "Sweden" },
      { code: "NO", name: "Norway" },
      { code: "DK", name: "Denmark" },
      { code: "PL", name: "Poland" },
      { code: "RU", name: "Russia" },
      { code: "UA", name: "Ukraine" },
      { code: "BR", name: "Brazil" },
      { code: "MX", name: "Mexico" },
      { code: "AR", name: "Argentina" },
      { code: "CL", name: "Chile" },
      { code: "CO", name: "Colombia" },
      { code: "PE", name: "Peru" },
      { code: "CN", name: "China" },
      { code: "HK", name: "Hong Kong" },
      { code: "TW", name: "Taiwan" },
      { code: "JP", name: "Japan" },
      { code: "KR", name: "South Korea" },
      { code: "SG", name: "Singapore" },
      { code: "MY", name: "Malaysia" },
      { code: "TH", name: "Thailand" },
      { code: "VN", name: "Vietnam" },
      { code: "PH", name: "Philippines" },
      { code: "ID", name: "Indonesia" },
      { code: "IN", name: "India" },
      { code: "PK", name: "Pakistan" },
      { code: "BD", name: "Bangladesh" },
      { code: "NZ", name: "New Zealand" },
      { code: "TR", name: "Turkey" },
      { code: "IL", name: "Israel" },
      { code: "DZ", name: "Algeria" },
      { code: "TN", name: "Tunisia" },
      { code: "SN", name: "Senegal" },
      { code: "CI", name: "Côte d'Ivoire" },
      { code: "CM", name: "Cameroon" },
      { code: "UG", name: "Uganda" },
      { code: "TZ", name: "Tanzania" },
      { code: "ET", name: "Ethiopia" }
    ];
  }

  function buildKycGate({ me, onComplete }) {
    ensureKycGateCss();
    if (typeof document === "undefined") return null;
    const existing = document.getElementById("vtKycGate");
    if (existing) existing.remove();

    const gate = document.createElement("div");
    gate.id = "vtKycGate";
    document.body.appendChild(gate);
    document.body.style.overflow = "hidden";

    const profile = (me && me.profile) || {};
    const currentLang = (me && me.preferredLanguage) || "en";

    const countries = countryOptions();
    const dict = DICT[currentLang] ? DICT[currentLang] : DICT.en;

    function buildLanguageOptions(countryCode, selectedCode) {
      const info = getCountryLanguages(countryCode);
      const allowed = new Set(["en", "es", "fr", "de", "pt", "ru", "zh", "ar"]);
      const codes = (info.langs && info.langs.length ? info.langs : ["en", "es", "fr", "de", "pt", "ru", "zh", "ar"])
        .filter((c) => allowed.has(c) || allowed.has(String(c).split("-")[0]))
        .map((c) => allowed.has(c) ? c : String(c).split("-")[0]);
      const seen = new Set();
      const list = [];
      for (const c of codes) {
        if (!seen.has(c)) { seen.add(c); list.push(c); }
      }
      if (!list.includes("en")) list.unshift("en");
      const primary = info.primary || (list[0] || "en");
      const primaryBase = allowed.has(primary) ? primary : (allowed.has(String(primary).split("-")[0]) ? String(primary).split("-")[0] : "en");
      const opts = list
        .map((c) => ({ code: c, name: languageName(c) }))
        .sort((a, b) => (a.code === primaryBase ? -1 : b.code === primaryBase ? 1 : 0));
      return { options: opts, defaultCode: selectedCode || primaryBase };
    }

    let initialCountry = (profile.country || "").trim();
    if (!initialCountry) initialCountry = "";
    const initialInfo = buildLanguageOptions(initialCountry, (profile.preferredLanguage || currentLang));

    const countryOptionHtml = [
      `<option value="">-- ${dict.kyc_country || "Country"} --</option>`,
      ...countries.map((c) => `<option value="${c.code}" ${initialCountry === c.code ? "selected" : ""}>${escapeHtml(c.name)}</option>`)
    ].join("");

    const languageOptionHtml = (opts, sel) => {
      return opts
        .map((o) => `<option value="${o.code}" ${o.code === sel ? "selected" : ""}>${escapeHtml(o.name)}</option>`)
        .join("");
    };

    const genderOptions = [
      `<option value="">-- ${dict.kyc_gender || "Gender"} --</option>`,
      `<option value="male" ${profile.gender === "male" ? "selected" : ""}>${dict.kyc_gender_male || "Male"}</option>`,
      `<option value="female" ${profile.gender === "female" ? "selected" : ""}>${dict.kyc_gender_female || "Female"}</option>`,
      `<option value="other" ${profile.gender === "other" ? "selected" : ""}>${dict.kyc_gender_other || "Other"}</option>`,
      `<option value="prefer_not_say" ${profile.gender === "prefer_not_say" ? "selected" : ""}>${dict.kyc_gender_prefernotsay || "Prefer not to say"}</option>`
    ].join("");

    gate.innerHTML = `
      <div class="k-shell">
        <div class="k-brand">
          <img src="/assets/images/brand/logo_VanguardDoubleTrust_white.svg" alt="VanguardDoubleTrust" />
          <div style="color:#94a3b8; font-size:12px" data-i18n="nav_kyc">${dict.nav_kyc}</div>
        </div>
        <div class="k-head">
          <h1 data-i18n="kyc_title">${dict.kyc_title}</h1>
          <p data-i18n="kyc_subtitle">${dict.kyc_subtitle}</p>
        </div>
        <div class="k-warn" data-i18n="kyc_required_warning">${dict.kyc_required_warning}</div>
        <div class="k-card">
          <form id="vtKycForm" autocomplete="on" novalidate>
            <div class="k-grid">
              <div>
                <label data-i18n="kyc_firstname">${dict.kyc_firstname}<span class="req">*</span></label>
                <input id="kFirstname" name="firstname" type="text" value="${escapeHtml(profile.firstname || "")}" autocomplete="given-name" required />
                <div class="k-err" data-k-err="firstname"></div>
              </div>
              <div>
                <label data-i18n="kyc_lastname">${dict.kyc_lastname}<span class="req">*</span></label>
                <input id="kLastname" name="lastname" type="text" value="${escapeHtml(profile.lastname || "")}" autocomplete="family-name" required />
                <div class="k-err" data-k-err="lastname"></div>
              </div>
              <div>
                <label data-i18n="kyc_phone">${dict.kyc_phone}</label>
                <input id="kPhone" name="phone" type="tel" value="${escapeHtml(profile.phone || "")}" autocomplete="tel" inputmode="tel" />
                <div class="k-err" data-k-err="phone"></div>
              </div>
              <div>
                <label data-i18n="kyc_country">${dict.kyc_country}<span class="req">*</span></label>
                <select id="kCountry" name="country" required>${countryOptionHtml}</select>
                <div class="k-err" data-k-err="country"></div>
              </div>
              <div>
                <label data-i18n="kyc_language">${dict.kyc_language}</label>
                <select id="kLanguage" name="preferredLanguage">${languageOptionHtml(initialInfo.options || [], initialInfo.defaultCode || "en")}</select>
                <div class="k-err" data-k-err="preferredLanguage"></div>
              </div>
              <div>
                <label data-i18n="kyc_gender">${dict.kyc_gender}</label>
                <select id="kGender" name="gender">${genderOptions}</select>
              </div>
              <div>
                <label data-i18n="kyc_dob">${dict.kyc_dob}</label>
                <input id="kDob" name="dateOfBirth" type="date" value="${escapeHtml(profile.dateOfBirth || profile.dob || "")}" />
              </div>
              <div>
                <label data-i18n="kyc_nationality">${dict.kyc_nationality}</label>
                <input id="kNationality" name="nationality" type="text" value="${escapeHtml(profile.nationality || "")}" />
              </div>
              <div>
                <label data-i18n="kyc_occupation">${dict.kyc_occupation}</label>
                <input id="kOccupation" name="occupation" type="text" value="${escapeHtml(profile.occupation || "")}" />
              </div>
              <div class="k-full">
                <label data-i18n="kyc_address">${dict.kyc_address}</label>
                <input id="kAddress" name="address" type="text" value="${escapeHtml(profile.address || "")}" autocomplete="street-address" />
              </div>
              <div>
                <label data-i18n="kyc_city">${dict.kyc_city}</label>
                <input id="kCity" name="city" type="text" value="${escapeHtml(profile.city || "")}" autocomplete="address-level2" />
              </div>
              <div>
                <label data-i18n="kyc_state">${dict.kyc_state}</label>
                <input id="kState" name="state" type="text" value="${escapeHtml(profile.state || "")}" autocomplete="address-level1" />
              </div>
              <div class="k-full">
                <label data-i18n="kyc_zip">${dict.kyc_zip}</label>
                <input id="kZip" name="zipCode" type="text" value="${escapeHtml(profile.zipCode || "")}" autocomplete="postal-code" />
              </div>
            </div>
            <div class="k-actions">
              <button type="submit" class="k-btn primary" id="kSubmitBtn" data-i18n="kyc_submit">${dict.kyc_submit}</button>
            </div>
          </form>
        </div>
        <div class="k-foot" data-i18n="footer_rights">© ${new Date().getFullYear()} VanguardDoubleTrust. ${dict.footer_rights}</div>
      </div>
    `;

    const form = gate.querySelector("#vtKycForm");
    const countryEl = gate.querySelector("#kCountry");
    const languageEl = gate.querySelector("#kLanguage");

    function refreshLanguageOptions(selectedCode) {
      if (!countryEl || !languageEl) return;
      const countryCode = countryEl.value || "";
      const info = buildLanguageOptions(countryCode, "");
      const available = new Set((info.options || []).map((o) => o.code));
      let preferred = "";
      if (typeof selectedCode === "string" && selectedCode && available.has(selectedCode)) {
        preferred = selectedCode;
      } else if (available.has(languageEl.value) && !countryCode) {
        preferred = languageEl.value;
      }
      const finalSel = preferred || info.defaultCode || "en";
      languageEl.innerHTML = languageOptionHtml(info.options, finalSel);
    }

    countryEl && countryEl.addEventListener("change", () => {
      refreshLanguageOptions("");
    });

    form && form.addEventListener("submit", async (e) => {
      e.preventDefault();
      gate.querySelectorAll("[data-k-err]").forEach((el) => (el.textContent = ""));
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());
      const firstname = String(payload.firstname || "").trim();
      const lastname = String(payload.lastname || "").trim();
      const country = String(payload.country || "").trim();
      let hasErr = false;
      if (!firstname) {
        const el = gate.querySelector("[data-k-err='firstname']");
        if (el) { el.textContent = dict.kyc_required || "Required"; hasErr = true; }
      }
      if (!lastname) {
        const el = gate.querySelector("[data-k-err='lastname']");
        if (el) { el.textContent = dict.kyc_required || "Required"; hasErr = true; }
      }
      if (!country) {
        const el = gate.querySelector("[data-k-err='country']");
        if (el) { el.textContent = dict.kyc_required || "Required"; hasErr = true; }
      }
      if (hasErr) return;
      const submitBtn = gate.querySelector("#kSubmitBtn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = dict.kyc_submitting || "Saving…";
      }
      try {
        const data = await api("/api/customer/kyc", {
          method: "POST",
          body: JSON.stringify({
            firstname,
            lastname,
            country,
            preferredLanguage: String(payload.preferredLanguage || "en"),
            phone: String(payload.phone || "").trim(),
            gender: String(payload.gender || "").trim(),
            dateOfBirth: String(payload.dateOfBirth || "").trim(),
            nationality: String(payload.nationality || "").trim(),
            occupation: String(payload.occupation || "").trim(),
            address: String(payload.address || "").trim(),
            city: String(payload.city || "").trim(),
            state: String(payload.state || "").trim(),
            zipCode: String(payload.zipCode || "").trim()
          })
        });
        const newLang = (data && data.preferredLanguage) || (data && data.profile && data.profile.preferredLanguage) || "en";
        applyLanguageToDocument(newLang, document);
        toastMessage(DICT[newLang]?.kyc_success || dict.kyc_success, "ok");
        gate.remove();
        try { document.body.style.overflow = ""; } catch (_) {}
        if (typeof onComplete === "function") {
          try { onComplete({ data: data || {}, language: newLang }); } catch (_) {}
        }
      } catch (err) {
        toastMessage(String(err?.message || dict.kyc_genericError || "Unable to save."), "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = dict.kyc_submit || "Complete Setup";
        }
      }
    });

    applyLanguageToDocument(currentLang, gate);
    return gate;
  }

  async function bootstrapCustomerPage(options) {
    if (typeof document === "undefined") return null;
    let me = null;
    try {
      me = await api("/api/me");
    } catch (err) {
      const str = String(err?.message || "");
      if (/unauthorized|sign in|session ended/i.test(str) || /401|403/.test(str)) {
        window.location.href = "/customer/login.php.html";
      }
      throw err;
    }
    const lang = (me && me.preferredLanguage) || "en";
    applyLanguageToDocument(lang, document);
    const kycNeeded = !!(me && me.security && me.security.kycCompleted === false) ||
      !!((me && (!me.security || me.security.kycCompleted !== true)) && !(
        (me.profile && me.profile.country) && (me.profile && me.profile.firstname) && (me.profile && me.profile.lastname) && (me.profile && me.profile.preferredLanguage)
      ));
    if (options && options.alwaysShowKyc !== true && !kycNeeded) {
      if (options && typeof options.after === "function") {
        try { options.after({ me, language: lang, kycCompleted: true }); } catch (_) {}
      }
      return { me, language: lang, kycCompleted: true };
    }
    return new Promise((resolve) => {
      buildKycGate({
        me: me || {},
        onComplete: ({ data, language }) => {
          const mergedMe = Object.assign({}, me || {}, data || {});
          if (options && typeof options.after === "function") {
            try { options.after({ me: mergedMe, language, kycCompleted: true }); } catch (_) {}
          }
          resolve({ me: mergedMe, language, kycCompleted: true });
        }
      });
    });
  }

  const exports = {
    I18N: {
      dict: DICT,
      countryLanguages: COUNTRY_LANGS,
      t,
      apply: applyLanguageToDocument,
      forCountry: getCountryLanguages,
      languageName,
      availableLanguages: availableDictionaryLanguages,
      countryOptions,
      dictForCode
    },
    API: {
      fetchJson,
      api,
      me: () => fetchJson("/api/me")
    },
    UI: {
      toast: toastMessage,
      showKycGate: buildKycGate,
      bootstrapCustomerPage
    }
  };

  if (typeof document !== "undefined") {
    window.VT = window.VT || {};
    window.VT.I18N = exports.I18N;
    window.VT.API = exports.API;
    window.VT.UI = exports.UI;
  }

  return exports;
});
