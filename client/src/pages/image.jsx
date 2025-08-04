  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { posts, myPosts, loading, error} = useSelector((state) => state.post);

  const [newPostContent, setNewPostContent] = useState("");
  
  const [editing, setEditing] = useState(false);
  const [name, setname] = useState(user?.name || "");
  const [bio, setbio] = useState(user?.bio || "");

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast.error("Content is required.");
      return;  
    }
    const response = await dispatch(createPost({ content: newPostContent }));
    if (createPost.fulfilled.match(response)) {
        toast.success("Content created successfully.");
        await dispatch(getPostsByUser())
    }
  }

  const handleEditPost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast.error("Content is required.");
      return;  
    }
    const response = await dispatch(createPost({ content: newPostContent }));
    if (createPost.fulfilled.match(response)) {
        toast.success("Content created successfully.");
        await dispatch(getPostsByUser())
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() && !bio.trim()) {
      toast.error("Name and bio are required.");
      return;  
    }
    const response = await dispatch(updateUser({name, bio}));
    if (updateUser.fulfilled.match(response)) {
        toast.success(`Welcome to ${email}.`);
        setEditing(false)
    }
  }

  const handleLogout = async() => {
    const response = await dispatch(logoutUser());
    if(logoutUser.fulfilled.match(response)){
       navigate("/login")
    }
  };