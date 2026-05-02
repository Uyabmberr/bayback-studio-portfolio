const form = document.querySelector("[data-message-form]");
const output = document.querySelector("[data-message-output]");
const dmLink = document.querySelector("[data-dm-link]");
const channelModal = document.querySelector("[data-channel-modal]");
const channelDialogName = document.querySelector("[data-channel-dialog-name]");
const channelDialogType = document.querySelector("[data-channel-dialog-type]");
const channelDialogCategory = document.querySelector("[data-channel-dialog-category]");
const channelProfile = document.querySelector("[data-channel-profile]");
const channelBriefButton = document.querySelector("[data-channel-brief]");
const channelCategoryButton = document.querySelector("[data-channel-category-button]");
const channelCategoryNote = document.querySelector("[data-channel-category-note]");
const closeChannelButtons = document.querySelectorAll("[data-close-channel]");

const instagramProfile = "https://www.instagram.com/bayback_/";
let activeChannel = null;

function buildMessage(formData) {
  return [
    "Halo Bayback, saya ingin diskusi project.",
    "",
    `Nama: ${formData.get("name")}`,
    `Kebutuhan: ${formData.get("service")}`,
    `Brief: ${formData.get("brief")}`,
    "",
    "Saya lihat portfolio Bayback dan ingin tahu estimasi pengerjaan."
  ].join("\n");
}

function processInstagramEmbeds() {
  if (window.instgrm?.Embeds) {
    window.instgrm.Embeds.process();
  }
}

function runRevealMotion() {
  const groups = document.querySelectorAll(".reveal-group");
  const looseItems = document.querySelectorAll(".reveal-item:not(.reveal-group .reveal-item)");

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal-group, .reveal-item").forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  groups.forEach((group) => observer.observe(group));
  looseItems.forEach((item) => observer.observe(item));
}

function openChannelModal(channel) {
  activeChannel = channel;
  channelDialogName.textContent = channel.name;
  channelDialogType.textContent = channel.type;
  channelDialogCategory.textContent = channel.category;
  channelProfile.href = channel.url;
  channelCategoryNote.hidden = true;
  channelCategoryNote.textContent = "";
  Object.assign(channelModal.style, {
    display: "grid",
    opacity: "1",
    pointerEvents: "auto",
    position: "fixed",
    zIndex: "2147483647"
  });
  channelModal.classList.add("is-open");
  channelModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeChannelModal() {
  channelModal.classList.remove("is-open");
  channelModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  Object.assign(channelModal.style, {
    opacity: "",
    pointerEvents: "",
    position: "",
    zIndex: ""
  });
}

function moveToBrief(channel) {
  const briefField = form?.elements.brief;
  const serviceField = form?.elements.service;
  const message = `Saya ingin membuat project untuk ${channel.name}: ${channel.category}`;

  if (serviceField) {
    serviceField.value = channel.type === "Personal" ? "Editing video cinematic" : "Desain sosial media premium";
  }

  if (briefField && !briefField.value.includes(channel.name)) {
    briefField.value = briefField.value ? `${briefField.value}\n\n${message}` : message;
  }

  closeChannelModal();
  document.querySelector("#pesan")?.scrollIntoView({ behavior: "smooth", block: "start" });
  briefField?.focus({ preventScroll: true });
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const message = buildMessage(formData);
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  output.innerHTML = "";

  const preview = document.createElement("span");
  preview.textContent = message;

  const action = document.createElement("a");
  action.className = "button primary";
  action.href = whatsappUrl;
  action.target = "_blank";
  action.rel = "noreferrer";
  action.textContent = "Kirim WhatsApp";

  output.append(preview, action);

  dmLink.href = instagramProfile;
});

document.addEventListener("click", (event) => {
  const card = event.target.closest("[data-channel-name]");

  if (card) {
    openChannelModal({
      name: card.dataset.channelName,
      type: card.dataset.channelType,
      url: card.dataset.channelUrl,
      category: card.dataset.channelCategory
    });
  }
});

closeChannelButtons.forEach((button) => {
  button.addEventListener("click", closeChannelModal);
});

channelBriefButton?.addEventListener("click", () => {
  if (activeChannel) {
    moveToBrief(activeChannel);
  }
});

channelCategoryButton?.addEventListener("click", () => {
  if (!activeChannel) return;

  channelCategoryNote.hidden = false;
  channelCategoryNote.textContent = activeChannel.category;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && channelModal?.classList.contains("is-open")) {
    closeChannelModal();
  }
});

window.addEventListener("load", () => {
  processInstagramEmbeds();
  runRevealMotion();
});
