"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { FadeIn } from "@/components/Motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  X,
  Home,
  Building2,
  MapPin,
  IndianRupee,
  Camera,
  FileCheck,
  Phone,
  FileText,
  ClipboardCheck,
  Video,
} from "lucide-react";
import Image from "next/image";

const STEPS = [
  { label: "Basic Info", icon: Home },
  { label: "Details", icon: Building2 },
  { label: "Pricing", icon: IndianRupee },
  { label: "Photos", icon: Camera },
  { label: "Review", icon: FileCheck },
];

const PROPERTY_TYPES: Record<string, string[]> = {
  residential: [
    "apartment",
    "villa",
    "builder-floor",
    "independent-house",
    "penthouse",
    "studio",
    "farm-house",
  ],
  commercial: [
    "office",
    "retail",
    "warehouse",
    "coworking",
    "showroom",
    "commercial-land",
  ],
  plots: [
    "residential-plot",
    "farm-land",
    "agricultural-land",
    "industrial-land",
  ],
};

const AMENITIES_LIST = [
  "parking",
  "lift",
  "gym",
  "swimming-pool",
  "power-backup",
  "security",
  "garden",
  "clubhouse",
  "fire-safety",
  "intercom",
  "water-storage",
  "rain-water-harvesting",
  "waste-disposal",
  "visitor-parking",
  "piped-gas",
  "gated-community",
  "cctv",
  "maintenance-staff",
  "wi-fi",
  "ac",
];

const STATES_AND_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Tirupati",
    "Kakinada",
    "Rajahmundry",
    "Kadapa",
    "Anantapur",
  ],
  "Arunachal Pradesh": [
    "Itanagar",
    "Naharlagun",
    "Pasighat",
    "Tezpur",
    "Bomdila",
  ],
  Assam: [
    "Guwahati",
    "Silchar",
    "Dibrugarh",
    "Jorhat",
    "Nagaon",
    "Tinsukia",
    "Tezpur",
    "Sivsagar",
  ],
  Bihar: [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Purnia",
    "Darbhanga",
    "Bihar Sharif",
    "Arrah",
  ],
  Chhattisgarh: [
    "Raipur",
    "Bhilai",
    "Bilaspur",
    "Korba",
    "Durg",
    "Rajnandgaon",
    "Jagdalpur",
  ],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim"],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Gandhinagar",
    "Anand",
    "Nadiad",
    "Morbi",
  ],
  Haryana: [
    "Faridabad",
    "Gurugram",
    "Panipat",
    "Ambala",
    "Yamunanagar",
    "Rohtak",
    "Hisar",
    "Karnal",
    "Sonipat",
    "Panchkula",
  ],
  "Himachal Pradesh": [
    "Shimla",
    "Manali",
    "Dharamsala",
    "Solan",
    "Mandi",
    "Kullu",
    "Hamirpur",
    "Chamba",
  ],
  Jharkhand: [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Deoghar",
    "Hazaribagh",
    "Giridih",
    "Ramgarh",
  ],
  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Mangaluru",
    "Kalaburagi",
    "Belagavi",
    "Davanagere",
    "Bellary",
    "Shivamogga",
    "Tumkur",
    "Udupi",
  ],
  Kerala: [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Kollam",
    "Thrissur",
    "Alappuzha",
    "Kannur",
    "Kottayam",
    "Palakkad",
    "Malappuram",
  ],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Rewa",
    "Satna",
    "Dewas",
    "Chhindwara",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Kalyan",
    "Aurangabad",
    "Solapur",
    "Navi Mumbai",
    "Kolhapur",
    "Amravati",
    "Vasai-Virar",
  ],
  Manipur: ["Imphal", "Thoubal", "Kakching", "Churachandpur", "Bishnupur"],
  Meghalaya: ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar"],
  Mizoram: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Wokha", "Tuensang"],
  Odisha: [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Brahmapur",
    "Sambalpur",
    "Puri",
    "Balasore",
    "Bhadrak",
  ],
  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Hoshiarpur",
    "Mohali",
    "Pathankot",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Udaipur",
    "Bhilwara",
    "Alwar",
    "Sikar",
    "Hanumangarh",
  ],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Vellore",
    "Erode",
    "Thoothukudi",
    "Nagercoil",
  ],
  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Khammam",
    "Ramagundam",
    "Mancherial",
    "Adilabad",
  ],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Ambassa"],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Meerut",
    "Allahabad",
    "Ghaziabad",
    "Noida",
    "Bareilly",
    "Aligarh",
    "Mathura",
    "Moradabad",
  ],
  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Roorkee",
    "Haldwani",
    "Rishikesh",
    "Kashipur",
    "Nainital",
    "Mussoorie",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Asansol",
    "Siliguri",
    "Durgapur",
    "Bardhaman",
    "Malda",
    "Baharampur",
  ],
  Delhi: [
    "New Delhi",
    "Dwarka",
    "Rohini",
    "Janakpuri",
    "Saket",
    "Laxmi Nagar",
    "Pitampura",
    "Vasant Kunj",
    "Greater Kailash",
  ],
  Chandigarh: ["Chandigarh"],
  Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
  Ladakh: ["Leh", "Kargil"],
  "Andaman & Nicobar": ["Port Blair"],
  Lakshadweep: ["Kavaratti"],
  "Dadra & Nagar Haveli": ["Silvassa"],
  "Daman & Diu": ["Daman", "Diu"],
};

interface FormData {
  listingIntent: string;
  category: string;
  propertyType: string;
  city: string;
  area: string;
  state: string;
  pincode: string;
  landmark: string;
  title: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  areaSqft: string;
  carpetArea: string;
  floorNumber: string;
  totalFloors: string;
  facing: string;
  furnishing: string;
  propertyAge: string;
  possessionStatus: string;
  price: string;
  priceNegotiable: boolean;
  securityDeposit: string;
  maintenanceCharge: string;
  ownershipType: string;
  amenities: string[];
  images: string[];
  videos: string[];
  documents: string[];
  contactPhone: string;
  consentChecked: boolean;
}

const initialFormData: FormData = {
  listingIntent: "buy",
  category: "residential",
  propertyType: "apartment",
  city: "",
  area: "",
  state: "",
  pincode: "",
  landmark: "",
  title: "",
  description: "",
  bedrooms: "",
  bathrooms: "",
  balconies: "",
  areaSqft: "",
  carpetArea: "",
  floorNumber: "",
  totalFloors: "",
  facing: "",
  furnishing: "",
  propertyAge: "",
  possessionStatus: "",
  price: "",
  priceNegotiable: false,
  securityDeposit: "",
  maintenanceCharge: "",
  ownershipType: "",
  amenities: [],
  images: [],
  videos: [],
  documents: [],
  contactPhone: "",
  consentChecked: false,
};

export default function PostPropertyPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [uploading, setUploading] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");
  const [videoUploadError, setVideoUploadError] = useState("");
  const [docUploadError, setDocUploadError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <FadeIn className="text-center">
          <Home className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-white font-semibold text-xl mb-2">
            Login Required
          </h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to post a property
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            Login
          </button>
        </FadeIn>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <FadeIn className="text-center max-w-md">
          <div className="h-20 w-20 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardCheck className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="text-white font-bold text-2xl mb-3">
            Property Submitted!
          </h2>
          <p className="text-gray-400 mb-2">
            Your property is now under review.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Our team will verify the details and may contact you at{" "}
            <span className="text-white">{form.contactPhone}</span> for
            verification. You&apos;ll be notified once it&apos;s approved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/dashboard/properties")}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              View My Properties
            </button>
            <button
              onClick={() => {
                setForm(initialFormData);
                setStep(0);
                setSubmitted(false);
              }}
              className="px-6 py-2.5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm rounded-lg transition-colors"
            >
              Post Another Property
            </button>
          </div>
        </FadeIn>
      </div>
    );
  }

  const updateField = (
    field: keyof FormData,
    value: string | boolean | string[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field as string]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    }
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Extracts a human-readable message from any error type:
  // AxiosError (with/without response), plain Cloudinary object, or unknown thrown value.
  const extractUploadError = (err: any): string => {
    // Log as individual string args — Turbopack's console serializer drops undefined
    // values from objects, turning { status: undefined, ... } silently into {}.
    console.error(
      "Upload error |",
      "status:",
      String(err?.response?.status ?? "-"),
      "| code:",
      String(err?.code ?? "-"),
      "| message:",
      String(err?.message ?? "-"),
      "| data:",
      err?.response?.data ?? "-",
    );

    // Server returned a JSON error body
    const serverMsg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      (typeof err?.response?.data === "string" ? err.response.data : null);
    if (serverMsg) return serverMsg;

    // Network-level failures (server down, CORS, etc.)
    if (err?.code === "ERR_NETWORK" || err?.message === "Network Error")
      return "Network error – check your connection or try again.";

    // Request cancelled (e.g. navigate away mid-upload)
    if (err?.code === "ERR_CANCELED" || err?.message === "canceled")
      return "Upload was cancelled.";

    // Fallback to Axios / Error message
    if (err?.message) return err.message;

    return "Failed to upload – please try again.";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_IMAGES = 10;
    const MIN_SIZE_KB = 10;
    const MAX_SIZE_MB = 15;
    const currentCount = form.images.length;
    const incoming = files.length;

    // Count check
    if (currentCount + incoming > MAX_IMAGES) {
      const canAdd = MAX_IMAGES - currentCount;
      setImageUploadError(
        canAdd > 0
          ? `You can only add ${canAdd} more image${canAdd === 1 ? "" : "s"} (max ${MAX_IMAGES} total).`
          : `You've reached the limit of ${MAX_IMAGES} images. Remove some to upload new ones.`,
      );
      e.target.value = "";
      return;
    }

    // Size check — each file must be between 10 KB and 15 MB
    const tooSmall: string[] = [];
    const tooLarge: string[] = [];
    Array.from(files).forEach((file) => {
      const kb = file.size / 1024;
      const mb = kb / 1024;
      if (kb < MIN_SIZE_KB) tooSmall.push(file.name);
      else if (mb > MAX_SIZE_MB) tooLarge.push(file.name);
    });

    if (tooSmall.length > 0 || tooLarge.length > 0) {
      const parts: string[] = [];
      if (tooSmall.length > 0)
        parts.push(`Too small (min ${MIN_SIZE_KB} KB): ${tooSmall.join(", ")}`);
      if (tooLarge.length > 0)
        parts.push(`Too large (max ${MAX_SIZE_MB} MB): ${tooLarge.join(", ")}`);
      setImageUploadError(parts.join(" · "));
      e.target.value = "";
      return;
    }

    setImageUploadError("");
    setUploading(true);
    try {
      const formData = new window.FormData();
      Array.from(files).forEach((file) => formData.append("images", file));

      const res = await api.post("/upload/images", formData);

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...(res.data.urls ?? [])],
      }));
    } catch (err: any) {
      setError(extractUploadError(err));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUploadError("");
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const MAX_DOCS = 5;
  const DOC_MIN_SIZE_KB = 10;
  const DOC_MAX_SIZE_MB = 10;

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setDocUploadError("");

    const incoming = Array.from(files);
    const currentCount = form.documents.length;

    if (currentCount + incoming.length > MAX_DOCS) {
      setDocUploadError(
        `You can upload a maximum of ${MAX_DOCS} documents. You currently have ${currentCount} and are trying to add ${incoming.length} more.`,
      );
      e.target.value = "";
      return;
    }

    const minBytes = DOC_MIN_SIZE_KB * 1024;
    const maxBytes = DOC_MAX_SIZE_MB * 1024 * 1024;
    for (const file of incoming) {
      if (file.size < minBytes) {
        setDocUploadError(
          `"${file.name}" is too small (${Math.round(file.size / 1024)} KB). Minimum size is ${DOC_MIN_SIZE_KB} KB.`,
        );
        e.target.value = "";
        return;
      }
      if (file.size > maxBytes) {
        setDocUploadError(
          `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is ${DOC_MAX_SIZE_MB} MB.`,
        );
        e.target.value = "";
        return;
      }
    }

    setUploadingDocs(true);
    try {
      const formData = new window.FormData();
      incoming.forEach((file) => formData.append("documents", file));
      const res = await api.post("/upload/documents", formData);
      setForm((prev) => ({
        ...prev,
        documents: [...prev.documents, ...(res.data.urls ?? [])],
      }));
      setDocUploadError("");
    } catch (err: any) {
      setDocUploadError(extractUploadError(err));
    } finally {
      setUploadingDocs(false);
      e.target.value = "";
    }
  };

  const removeDocument = (index: number) => {
    setDocUploadError("");
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const MAX_VIDEOS = 3;
  const VIDEO_MIN_SIZE_MB = 1;
  const VIDEO_MAX_SIZE_MB = 100;

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentCount = form.videos.length;
    const incoming = files.length;

    if (currentCount + incoming > MAX_VIDEOS) {
      const canAdd = MAX_VIDEOS - currentCount;
      setVideoUploadError(
        canAdd > 0
          ? `You can only add ${canAdd} more video${canAdd === 1 ? "" : "s"} (max ${MAX_VIDEOS} total).`
          : `You've reached the limit of ${MAX_VIDEOS} videos. Remove some to upload new ones.`,
      );
      e.target.value = "";
      return;
    }

    const tooSmall: string[] = [];
    const tooLarge: string[] = [];
    Array.from(files).forEach((file) => {
      const mb = file.size / 1024 / 1024;
      if (mb < VIDEO_MIN_SIZE_MB) tooSmall.push(file.name);
      else if (mb > VIDEO_MAX_SIZE_MB) tooLarge.push(file.name);
    });

    if (tooSmall.length > 0 || tooLarge.length > 0) {
      const parts: string[] = [];
      if (tooSmall.length > 0)
        parts.push(
          `Too small (min ${VIDEO_MIN_SIZE_MB} MB): ${tooSmall.join(", ")}`,
        );
      if (tooLarge.length > 0)
        parts.push(
          `Too large (max ${VIDEO_MAX_SIZE_MB} MB): ${tooLarge.join(", ")}`,
        );
      setVideoUploadError(parts.join(" · "));
      e.target.value = "";
      return;
    }

    setVideoUploadError("");
    setUploadingVideos(true);
    setVideoUploadProgress(0);
    try {
      // Get signed upload params — browser uploads directly to Cloudinary
      const paramsRes = await api.get("/upload/video-upload-params");
      const { signature, timestamp, folder, api_key, cloud_name } =
        paramsRes.data;

      const fileList = Array.from(files);
      const uploaded: string[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const url = await new Promise<string>((resolve, reject) => {
          const fd = new window.FormData();
          fd.append("file", file);
          fd.append("api_key", api_key);
          fd.append("signature", signature);
          fd.append("timestamp", String(timestamp));
          fd.append("folder", folder);

          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`,
          );
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const overall =
                ((i + event.loaded / event.total) / fileList.length) * 100;
              setVideoUploadProgress(Math.round(overall));
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText).secure_url);
            } else {
              reject(
                new Error(
                  JSON.parse(xhr.responseText)?.error?.message ||
                    "Upload failed",
                ),
              );
            }
          };
          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(fd);
        });
        uploaded.push(url);
      }

      setForm((prev) => ({
        ...prev,
        videos: [...prev.videos, ...uploaded],
      }));
    } catch (err: any) {
      setVideoUploadError(extractUploadError(err));
    } finally {
      setUploadingVideos(false);
      setVideoUploadProgress(0);
      e.target.value = "";
    }
  };

  const removeVideo = (index: number) => {
    setVideoUploadError("");
    setForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        ...form,
        price: Number(form.price),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        balconies: form.balconies ? Number(form.balconies) : undefined,
        areaSqft: form.areaSqft ? Number(form.areaSqft) : undefined,
        carpetArea: form.carpetArea ? Number(form.carpetArea) : undefined,
        floorNumber: form.floorNumber ? Number(form.floorNumber) : undefined,
        totalFloors: form.totalFloors ? Number(form.totalFloors) : undefined,
        securityDeposit: form.securityDeposit
          ? Number(form.securityDeposit)
          : undefined,
        maintenanceCharge: form.maintenanceCharge
          ? Number(form.maintenanceCharge)
          : undefined,
      };

      // Remove empty strings and frontend-only fields
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || payload[key] === undefined) {
          delete payload[key];
        }
      });
      delete payload.consentChecked;

      await api.post("/properties", payload);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to post property",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      // Basic Info
      if (!form.state) errors.state = "State is required";
      if (!form.city) errors.city = "City is required";
      if (!form.area.trim()) errors.area = "Locality / Area is required";
      if (!form.pincode.trim()) {
        errors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(form.pincode.trim())) {
        errors.pincode = "Pincode must be exactly 6 digits";
      }
      if (!form.contactPhone.trim()) {
        errors.contactPhone = "Contact phone is required";
      } else if (!/^[6-9]\d{9}$/.test(form.contactPhone.trim())) {
        errors.contactPhone = "Enter a valid 10-digit Indian mobile number";
      }
    }

    if (step === 1) {
      // Details
      if (!form.areaSqft.trim()) {
        errors.areaSqft = "Built-up area is required";
      } else if (Number(form.areaSqft) <= 0) {
        errors.areaSqft = "Super area must be greater than 0";
      }
      if (
        form.carpetArea.trim() &&
        form.areaSqft.trim() &&
        Number(form.carpetArea) > Number(form.areaSqft)
      )
        errors.carpetArea = "Carpet area cannot be greater than super area";
      // Bedrooms/bathrooms required for residential only
      if (form.category === "residential" && !form.bedrooms)
        errors.bedrooms = "Bedrooms is required";
      if (form.category === "residential" && !form.bathrooms)
        errors.bathrooms = "Bathrooms is required";
      // Fields only shown when category !== plots
      if (form.category !== "plots") {
        if (!form.furnishing)
          errors.furnishing = "Furnishing status is required";
        if (!form.facing) errors.facing = "Facing direction is required";
        if (!form.propertyAge) errors.propertyAge = "Property age is required";
        if (!form.totalFloors.trim())
          errors.totalFloors = "Total floors is required";
        if (
          form.floorNumber.trim() &&
          form.totalFloors.trim() &&
          Number(form.floorNumber) > Number(form.totalFloors)
        )
          errors.floorNumber =
            "Floor number cannot be greater than total floors";
      }
      if (!form.possessionStatus)
        errors.possessionStatus = "Possession status is required";
    }

    if (step === 2) {
      // Pricing
      if (!form.price) {
        errors.price = "Price is required";
      } else if (Number(form.price) <= 0) {
        errors.price = "Price must be greater than 0";
      }
      if (!form.ownershipType)
        errors.ownershipType = "Ownership type is required";
    }

    if (step === 3) {
      // Review / Title & Description
      if (!form.title.trim()) errors.title = "Title is required";
      if (!form.description.trim())
        errors.description = "Description is required";
      if (!form.consentChecked)
        errors.consentChecked = "You must confirm your consent to continue";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStep(step + 1);
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors";
  const selectClass =
    "w-full bg-[#13131a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-colors";
  const optClass = "bg-[#13131a] text-white";
  const labelClass = "text-sm font-medium text-gray-300 mb-1.5 block";

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-[900px] mx-auto px-4 py-8">
        {/* Stepper */}
        <FadeIn className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isCompleted = i < step;
              return (
                <div key={s.label} className="flex items-center flex-1">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`flex items-center gap-2 shrink-0 ${i < step ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-white/5 border border-white/10 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block ${isActive ? "text-white" : isCompleted ? "text-green-400" : "text-gray-500"}`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-3 ${isCompleted ? "bg-green-600" : "bg-white/10"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Form Content */}
        <FadeIn className="bg-[#111118] border border-white/10 rounded-2xl p-6 md:p-8">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>

              {/* Listing Intent */}
              <div>
                <label className={labelClass}>I want to</label>
                <div className="flex gap-3">
                  {["buy", "rent"].map((intent) => (
                    <button
                      key={intent}
                      onClick={() => updateField("listingIntent", intent)}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors capitalize ${
                        form.listingIntent === intent
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {intent === "buy" ? "Sell" : "Rent / Lease"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={labelClass}>Property Category</label>
                <div className="flex gap-3">
                  {["residential", "commercial", "plots"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        updateField("category", cat);
                        updateField("propertyType", PROPERTY_TYPES[cat][0]);
                      }}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors capitalize ${
                        form.category === cat
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className={labelClass}>Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {(PROPERTY_TYPES[form.category] || []).map((type) => (
                    <button
                      key={type}
                      onClick={() => updateField("propertyType", type)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors capitalize ${
                        form.propertyType === type
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {type.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>State *</label>
                  <select
                    value={form.state}
                    onChange={(e) => {
                      updateField("state", e.target.value);
                      updateField("city", "");
                    }}
                    className={`${selectClass}${fieldErrors.state ? " !border-red-500/70" : ""}`}
                  >
                    <option value="" className={optClass}>
                      Select state
                    </option>
                    {Object.keys(STATES_AND_CITIES)
                      .sort()
                      .map((s) => (
                        <option key={s} value={s} className={optClass}>
                          {s}
                        </option>
                      ))}
                  </select>
                  {fieldErrors.state && (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldErrors.state}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>City *</label>
                  <select
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    disabled={!form.state}
                    className={`${selectClass}${fieldErrors.city ? " !border-red-500/70" : ""} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="" className={optClass}>
                      {form.state ? "Select city" : "Select state first"}
                    </option>
                    {(STATES_AND_CITIES[form.state] ?? []).map((c) => (
                      <option key={c} value={c} className={optClass}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.city && (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Locality / Area *</label>
                  <input
                    type="text"
                    placeholder="e.g. Andheri West"
                    value={form.area}
                    onChange={(e) => updateField("area", e.target.value)}
                    className={`${inputClass}${fieldErrors.area ? " !border-red-500/70" : ""}`}
                  />
                  {fieldErrors.area && (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldErrors.area}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Pincode *</label>
                  <input
                    type="text"
                    placeholder="e.g. 400053"
                    maxLength={6}
                    onKeyDown={(e) =>
                      !/\d/.test(e.key) &&
                      ![
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ].includes(e.key) &&
                      !e.ctrlKey &&
                      !e.metaKey &&
                      e.preventDefault()
                    }
                    value={form.pincode}
                    onChange={(e) =>
                      updateField("pincode", e.target.value.replace(/\D/g, ""))
                    }
                    className={`${inputClass}${fieldErrors.pincode ? " !border-red-500/70" : ""}`}
                  />
                  {fieldErrors.pincode && (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldErrors.pincode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Landmark</label>
                <input
                  type="text"
                  placeholder="Near..."
                  value={form.landmark}
                  onChange={(e) => updateField("landmark", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact Phone *</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  onKeyDown={(e) =>
                    !/\d/.test(e.key) &&
                    ![
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ].includes(e.key) &&
                    !e.ctrlKey &&
                    !e.metaKey &&
                    e.preventDefault()
                  }
                  value={form.contactPhone}
                  onChange={(e) =>
                    updateField(
                      "contactPhone",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                  className={`${inputClass}${fieldErrors.contactPhone ? " !border-red-500/70" : ""}`}
                />
                {fieldErrors.contactPhone && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.contactPhone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Property Details
              </h2>

              {form.category === "residential" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>BHK *</label>
                    <select
                      value={form.bedrooms}
                      onChange={(e) => updateField("bedrooms", e.target.value)}
                      className={`${selectClass}${fieldErrors.bedrooms ? " !border-red-500/70" : ""}`}
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="" className={optClass}>
                        Select
                      </option>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n} className={optClass}>
                          {n} BHK
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms *</label>
                    <select
                      value={form.bathrooms}
                      onChange={(e) => updateField("bathrooms", e.target.value)}
                      className={`${selectClass}${fieldErrors.bathrooms ? " !border-red-500/70" : ""}`}
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="" className={optClass}>
                        Select
                      </option>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n} className={optClass}>
                          {n}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.bathrooms && (
                      <p className="mt-1 text-xs text-red-400">
                        {fieldErrors.bathrooms}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Balconies</label>
                    <select
                      value={form.balconies}
                      onChange={(e) => updateField("balconies", e.target.value)}
                      className={selectClass}
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="" className={optClass}>
                        Select
                      </option>
                      {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n} value={n} className={optClass}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Super Area (sqft) *</label>
                  <input
                    type="number"
                    min="0"
                    onKeyDown={(e) =>
                      ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()
                    }
                    placeholder="e.g. 1450"
                    value={form.areaSqft}
                    onChange={(e) => updateField("areaSqft", e.target.value)}
                    className={`${inputClass}${fieldErrors.areaSqft ? " !border-red-500/70" : ""}`}
                  />
                  {fieldErrors.areaSqft && (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldErrors.areaSqft}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Carpet Area (sqft)</label>
                  <input
                    type="number"
                    min="0"
                    onKeyDown={(e) =>
                      ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()
                    }
                    placeholder="e.g. 1200"
                    value={form.carpetArea}
                    onChange={(e) => updateField("carpetArea", e.target.value)}
                    className={`${inputClass}${fieldErrors.carpetArea ? " !border-red-500/70" : ""}`}
                  />
                  {fieldErrors.carpetArea && (
                    <p className="mt-1 text-xs text-red-400">
                      {fieldErrors.carpetArea}
                    </p>
                  )}
                </div>
              </div>

              {form.category !== "plots" && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Floor Number</label>
                      <input
                        type="number"
                        min="0"
                        onKeyDown={(e) =>
                          ["-", "+", "e", "E"].includes(e.key) &&
                          e.preventDefault()
                        }
                        placeholder="e.g. 5"
                        value={form.floorNumber}
                        onChange={(e) =>
                          updateField("floorNumber", e.target.value)
                        }
                        className={`${inputClass}${fieldErrors.floorNumber ? " !border-red-500/70" : ""}`}
                      />
                      {fieldErrors.floorNumber && (
                        <p className="mt-1 text-xs text-red-400">
                          {fieldErrors.floorNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Total Floors *</label>
                      <input
                        type="number"
                        min="0"
                        onKeyDown={(e) =>
                          ["-", "+", "e", "E"].includes(e.key) &&
                          e.preventDefault()
                        }
                        placeholder="e.g. 20"
                        value={form.totalFloors}
                        onChange={(e) =>
                          updateField("totalFloors", e.target.value)
                        }
                        className={`${inputClass}${fieldErrors.totalFloors ? " !border-red-500/70" : ""}`}
                      />
                      {fieldErrors.totalFloors && (
                        <p className="mt-1 text-xs text-red-400">
                          {fieldErrors.totalFloors}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Facing *</label>
                      <select
                        value={form.facing}
                        onChange={(e) => updateField("facing", e.target.value)}
                        className={`${selectClass}${fieldErrors.facing ? " !border-red-500/70" : ""}`}
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" className={optClass}>
                          Select
                        </option>
                        {[
                          "north",
                          "south",
                          "east",
                          "west",
                          "north-east",
                          "north-west",
                          "south-east",
                          "south-west",
                        ].map((d) => (
                          <option key={d} value={d} className={optClass}>
                            {d.replace(/-/g, " ")}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.facing && (
                        <p className="mt-1 text-xs text-red-400">
                          {fieldErrors.facing}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Furnishing *</label>
                      <select
                        value={form.furnishing}
                        onChange={(e) =>
                          updateField("furnishing", e.target.value)
                        }
                        className={`${selectClass}${fieldErrors.furnishing ? " !border-red-500/70" : ""}`}
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" className={optClass}>
                          Select
                        </option>
                        {["furnished", "semi-furnished", "unfurnished"].map(
                          (f) => (
                            <option key={f} value={f} className={optClass}>
                              {f.replace(/-/g, " ")}
                            </option>
                          ),
                        )}
                      </select>
                      {fieldErrors.furnishing && (
                        <p className="mt-1 text-xs text-red-400">
                          {fieldErrors.furnishing}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Property Age *</label>
                      <select
                        value={form.propertyAge}
                        onChange={(e) =>
                          updateField("propertyAge", e.target.value)
                        }
                        className={`${selectClass}${fieldErrors.propertyAge ? " !border-red-500/70" : ""}`}
                        style={{ colorScheme: "dark" }}
                      >
                        <option value="" className={optClass}>
                          Select
                        </option>
                        {[
                          "under-construction",
                          "less-than-1-year",
                          "1-3-years",
                          "3-5-years",
                          "5-10-years",
                          "10-plus-years",
                        ].map((a) => (
                          <option key={a} value={a} className={optClass}>
                            {a.replace(/-/g, " ")}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.propertyAge && (
                        <p className="mt-1 text-xs text-red-400">
                          {fieldErrors.propertyAge}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className={labelClass}>Possession Status *</label>
                <div className="flex gap-3">
                  {["ready-to-move", "under-construction"].map((p) => (
                    <button
                      key={p}
                      onClick={() => updateField("possessionStatus", p)}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors capitalize ${
                        form.possessionStatus === p
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {p.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
                {fieldErrors.possessionStatus && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.possessionStatus}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Pricing */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Pricing</h2>

              <div>
                <label className={labelClass}>Price (₹) *</label>
                <input
                  type="number"
                  min="0"
                  onKeyDown={(e) =>
                    ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()
                  }
                  placeholder="e.g. 5000000"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className={`${inputClass}${fieldErrors.price ? " !border-red-500/70" : ""}`}
                />
                {fieldErrors.price && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.price}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateField("priceNegotiable", !form.priceNegotiable)
                  }
                  className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                    form.priceNegotiable
                      ? "bg-blue-600 border-blue-600"
                      : "border-white/20 bg-white/5"
                  }`}
                >
                  {form.priceNegotiable && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
                <span className="text-sm text-gray-300">
                  Price is negotiable
                </span>
              </div>

              {form.listingIntent === "rent" && (
                <div>
                  <label className={labelClass}>Security Deposit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    onKeyDown={(e) =>
                      ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()
                    }
                    placeholder="e.g. 100000"
                    value={form.securityDeposit}
                    onChange={(e) =>
                      updateField("securityDeposit", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>
                  Maintenance Charge (₹/month)
                </label>
                <input
                  type="number"
                  min="0"
                  onKeyDown={(e) =>
                    ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()
                  }
                  placeholder="e.g. 5000"
                  value={form.maintenanceCharge}
                  onChange={(e) =>
                    updateField("maintenanceCharge", e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Ownership Type *</label>
                <select
                  value={form.ownershipType}
                  onChange={(e) => updateField("ownershipType", e.target.value)}
                  className={`${selectClass}${fieldErrors.ownershipType ? " !border-red-500/70" : ""}`}
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" className={optClass}>
                    Select
                  </option>
                  {[
                    "freehold",
                    "leasehold",
                    "power-of-attorney",
                    "cooperative-society",
                  ].map((o) => (
                    <option key={o} value={o} className={optClass}>
                      {o.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
                {fieldErrors.ownershipType && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.ownershipType}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Photos & Description */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Photos & Description
              </h2>

              <div>
                <label className={labelClass}>Property Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 3 BHK Apartment in Andheri West"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className={`${inputClass}${fieldErrors.title ? " !border-red-500/70" : ""}`}
                />
                {fieldErrors.title && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  placeholder="Describe your property..."
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={`${inputClass} resize-none${fieldErrors.description ? " !border-red-500/70" : ""}`}
                />
                {fieldErrors.description && (
                  <p className="mt-1 text-xs text-red-400">
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className={labelClass}>
                  Photos (up to 10){" "}
                  <span className="text-gray-600 font-normal">
                    {form.images.length}/10 &middot; 10 KB – 15 MB per image
                  </span>
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {form.images.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-white/10"
                    >
                      <Image
                        src={url}
                        alt={`Upload ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 10 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors">
                      <Upload className="h-6 w-6 text-gray-500 mb-1" />
                      <span className="text-[10px] text-gray-500">
                        {uploading ? "Uploading..." : "Add Photo"}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
                {imageUploadError && (
                  <div className="mt-3 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-lg px-3.5 py-2.5">
                    <span className="text-red-400 text-lg leading-none mt-0.5">
                      &#9888;
                    </span>
                    <p className="text-red-400 text-sm flex-1">
                      {imageUploadError}
                    </p>
                    <button
                      onClick={() => setImageUploadError("")}
                      className="text-red-400/60 hover:text-red-400 transition-colors shrink-0"
                      aria-label="Dismiss"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className={labelClass}>
                  Videos (up to 3){" "}
                  <span className="text-gray-600 font-normal">
                    {form.videos.length}/3 &middot; 1 MB – 100 MB per video
                  </span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {form.videos.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded-lg overflow-hidden border border-white/10"
                    >
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <button
                        onClick={() => removeVideo(i)}
                        className="absolute top-1 right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {form.videos.length < MAX_VIDEOS && (
                    <label
                      className={`aspect-video rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors relative overflow-hidden${uploadingVideos ? " pointer-events-none" : ""}`}
                    >
                      {uploadingVideos && (
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-200"
                          style={{ width: `${videoUploadProgress}%` }}
                        />
                      )}
                      <Video className="h-6 w-6 text-gray-500 mb-1" />
                      <span className="text-[10px] text-gray-500">
                        {uploadingVideos
                          ? `Uploading ${videoUploadProgress}%`
                          : "Add Video"}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        disabled={uploadingVideos}
                      />
                    </label>
                  )}
                </div>
                {videoUploadError && (
                  <div className="mt-3 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-lg px-3.5 py-2.5">
                    <span className="text-red-400 text-lg leading-none mt-0.5">
                      &#9888;
                    </span>
                    <p className="text-red-400 text-sm flex-1">
                      {videoUploadError}
                    </p>
                    <button
                      onClick={() => setVideoUploadError("")}
                      className="text-red-400/60 hover:text-red-400 transition-colors shrink-0"
                      aria-label="Dismiss"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div>
                <label className={labelClass}>Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
                        form.amenities.includes(amenity)
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {amenity.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <label className={labelClass}>
                  Supporting Documents (PDF, optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload ownership proof, NOC, or any relevant document. Helps
                  speed up verification.
                </p>
                <div className="space-y-2">
                  {form.documents.map((url, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5"
                    >
                      <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline truncate flex-1"
                      >
                        Document {i + 1}
                      </a>
                      <button
                        onClick={() => removeDocument(i)}
                        className="h-5 w-5 bg-red-600/20 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                  {form.documents.length < MAX_DOCS && (
                    <label className="flex items-center gap-3 border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-lg px-4 py-3 cursor-pointer transition-colors">
                      <Upload className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {uploadingDocs
                          ? "Uploading..."
                          : `Upload PDF document · ${form.documents.length}/${MAX_DOCS} · ${DOC_MIN_SIZE_KB} KB – ${DOC_MAX_SIZE_MB} MB per file`}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="application/pdf"
                        onChange={handleDocumentUpload}
                        className="hidden"
                        disabled={uploadingDocs}
                      />
                    </label>
                  )}
                  {docUploadError && (
                    <div className="flex items-start gap-2 rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                      <span className="shrink-0">⚠</span>
                      <span className="flex-1">{docUploadError}</span>
                      <button
                        type="button"
                        onClick={() => setDocUploadError("")}
                        className="shrink-0 hover:text-red-200 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consentChecked}
                    onChange={(e) =>
                      updateField("consentChecked", e.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 rounded border-white/20 accent-blue-500"
                  />
                  <span className="text-sm text-gray-400">
                    I confirm that all the information provided is accurate and
                    I authorise The Leasing World to contact me for property
                    verification and listing purposes.
                  </span>
                </label>
                {fieldErrors.consentChecked && (
                  <p className="mt-2 text-xs text-red-400">
                    {fieldErrors.consentChecked}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Review & Submit
              </h2>

              <div className="space-y-4">
                <ReviewSection title="Basic Info" onEdit={() => setStep(0)}>
                  <ReviewRow
                    label="Listing"
                    value={form.listingIntent === "buy" ? "Sell" : "Rent"}
                  />
                  <ReviewRow label="Category" value={form.category} />
                  <ReviewRow
                    label="Type"
                    value={form.propertyType.replace(/-/g, " ")}
                  />
                  <ReviewRow
                    label="Location"
                    value={[form.area, form.city, form.state]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  {form.contactPhone && (
                    <ReviewRow
                      label="Contact Phone"
                      value={form.contactPhone}
                    />
                  )}
                </ReviewSection>

                <ReviewSection title="Details" onEdit={() => setStep(1)}>
                  {form.bedrooms && (
                    <ReviewRow label="BHK" value={`${form.bedrooms} BHK`} />
                  )}
                  {form.areaSqft && (
                    <ReviewRow label="Area" value={`${form.areaSqft} sqft`} />
                  )}
                  {form.floorNumber && (
                    <ReviewRow label="Floor" value={form.floorNumber} />
                  )}
                  {form.furnishing && (
                    <ReviewRow
                      label="Furnishing"
                      value={form.furnishing.replace(/-/g, " ")}
                    />
                  )}
                  {form.possessionStatus && (
                    <ReviewRow
                      label="Possession"
                      value={form.possessionStatus.replace(/-/g, " ")}
                    />
                  )}
                </ReviewSection>

                <ReviewSection title="Pricing" onEdit={() => setStep(2)}>
                  <ReviewRow
                    label="Price"
                    value={`₹${Number(form.price).toLocaleString("en-IN")}`}
                  />
                  {form.priceNegotiable && (
                    <ReviewRow label="Negotiable" value="Yes" />
                  )}
                  {form.maintenanceCharge && (
                    <ReviewRow
                      label="Maintenance"
                      value={`₹${Number(form.maintenanceCharge).toLocaleString("en-IN")}/mo`}
                    />
                  )}
                </ReviewSection>

                <ReviewSection
                  title="Photos & Description"
                  onEdit={() => setStep(3)}
                >
                  <ReviewRow label="Title" value={form.title} />
                  <ReviewRow
                    label="Photos"
                    value={`${form.images.length} uploaded`}
                  />
                  {form.videos.length > 0 && (
                    <ReviewRow
                      label="Videos"
                      value={`${form.videos.length} uploaded`}
                    />
                  )}
                  {form.documents.length > 0 && (
                    <ReviewRow
                      label="Documents"
                      value={`${form.documents.length} uploaded`}
                    />
                  )}
                  <ReviewRow
                    label="Amenities"
                    value={`${form.amenities.length} selected`}
                  />
                </ReviewSection>
              </div>

              {user &&
                !["admin", "super_admin", "agent"].includes(user.role) && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-amber-400 text-sm">
                    Your property will be submitted for review and will be
                    visible once approved by our team.
                  </div>
                )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm text-center mt-4">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 px-6 py-2.5 text-sm bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Property"}
                <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium text-sm">{title}</h3>
        <button
          onClick={onEdit}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-300 capitalize">{value}</span>
    </div>
  );
}
