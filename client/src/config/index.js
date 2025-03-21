export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "role",
    label: "Role",
    placeholder: "Select your role",
    componentType: "select",
    options: [
      { id: "buyer", label: "Buyer" },
      { id: "seller", label: "Seller" },
    ],
  },

];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "clothes", label: "Clothes" },
      { id: "electronics", label: "Electronics" },
      { id: "agriculture", label: "Agriculture" },
      { id: "healthcare", label: "Healthcare" },
      { id: "handcraft", label: "Handcraft" },
    ],
  },
  {
    label: "Subcategory",
    name: "subcategory",
    componentType: "select",
    options: [], // This will be dynamically populated
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const subcategoryOptionsMap = {
  clothes: [
    { id: "clothes-men", label: "Men's Clothes" },
    { id: "clothes-women", label: "Women's Clothes" },
    { id: "clothes-kids", label: "Kids' Clothes" },
  ],
  electronics: [
    { id: "electronics-mobiles", label: "Mobiles" },
    { id: "electronics-laptops", label: "Laptops" },
    { id: "electronics-accessories", label: "Electronics Accessories" },
  ],
  agriculture: [
    { id: "agriculture-organic", label: "Organic Products" },
    { id: "agriculture-seeds", label: "Seeds & Seedlings" },
    { id: "agriculture-tools", label: "Farming Tools" },
    { id: "agriculture-fertilizers", label: "Natural Fertilizers" },
  ],
  healthcare: [
    { id: "healthcare-herbal", label: "Herbal Remedies" },
    { id: "healthcare-wellness", label: "Wellness Products" },
    { id: "healthcare-personal", label: "Personal Care" },
    { id: "healthcare-hygiene", label: "Hygiene Products" },
  ],
  handcraft: [
    { id: "handcraft-pottery", label: "Pottery & Ceramics" },
    { id: "handcraft-textiles", label: "Handwoven Textiles" },
    { id: "handcraft-jewelry", label: "Handmade Jewelry" },
    { id: "handcraft-decor", label: "Home Decor Items" },
  ],
};

export const shoppingViewHeaderMenuItems = [
  {
    id: "landing",
    label: "Home",
    path: "/shop/land",
  },
  {
    id: "home",
    label: "Marketplace",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id:"ai-tool",
    label:"AI Tool",
    path:"/shop/ai",
  },
  {
    id:"jobs",
    label:"Jobs",
    path:"/shop/jobs",
  },
  /*{
    id: "men",
    label: "Men",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },*/
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
  agriculture: "Agriculture",
  healthcare: "Healthcare",
  handcraft: "Handcraft",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
    { id: "agriculture", label: "Agriculture" },
    { id: "healthcare", label: "Healthcare" },
    { id: "handcraft", label: "Handcraft" },
  ],
  subcategory: [
    // Existing subcategories
    { id: "clothes-men", label: "Men's Clothes" },
    { id: "clothes-women", label: "Women's Clothes" },
    { id: "clothes-kids", label: "Kids' Clothes" },
    { id: "electronics-mobiles", label: "Mobiles" },
    { id: "electronics-laptops", label: "Laptops" },
    { id: "electronics-accessories", label: "Electronics Accessories" },
    
    // Agriculture subcategories
    { id: "agriculture-organic", label: "Organic Products" },
    { id: "agriculture-seeds", label: "Seeds & Seedlings" },
    { id: "agriculture-tools", label: "Farming Tools" },
    { id: "agriculture-fertilizers", label: "Natural Fertilizers" },
    
    // Healthcare subcategories
    { id: "healthcare-herbal", label: "Herbal Remedies" },
    { id: "healthcare-wellness", label: "Wellness Products" },
    { id: "healthcare-personal", label: "Personal Care" },
    { id: "healthcare-hygiene", label: "Hygiene Products" },
    
    // Handcraft subcategories
    { id: "handcraft-pottery", label: "Pottery & Ceramics" },
    { id: "handcraft-textiles", label: "Handwoven Textiles" },
    { id: "handcraft-jewelry", label: "Handmade Jewelry" },
    { id: "handcraft-decor", label: "Home Decor Items" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];