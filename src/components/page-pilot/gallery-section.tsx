'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { captionImage } from '@/ai/flows/caption-image-flow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface GalleryImage {
  src: string;
  largeSrc: string;
  hint: string;
  caption: string;
}

const initialGalleryImages: GalleryImage[] = [
  { src: 'https://placehold.co/600x400.png', largeSrc: 'https://placehold.co/1200x800.png', hint: 'office team', caption: 'Our dedicated team collaborating on the next big thing.' },
  { src: 'https://placehold.co/600x400.png', largeSrc: 'https://placehold.co/1200x800.png', hint: 'community event', caption: 'Highlights from our recent community outreach event.' },
  { src: 'https://placehold.co/600x400.png', largeSrc: 'https://placehold.co/1200x800.png', hint: 'product workshop', caption: 'Engaging with clients during a product workshop.' },
];

export function GallerySection() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialGalleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingCaption, setEditingCaption] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingIndex]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoDataUri = e.target?.result as string;
        try {
          const { caption } = await captionImage({ photoDataUri });
          const newImage = {
            src: photoDataUri,
            largeSrc: photoDataUri,
            hint: 'uploaded image',
            caption,
          };
          setGalleryImages((prevImages) => [newImage, ...prevImages]);
        } catch (error) {
          console.error('Error generating caption:', error);
          // Handle error, maybe show a toast notification
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow uploading the same file again
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // prevent modal from opening
    setEditingIndex(index);
    setEditingCaption(galleryImages[index].caption);
  };

  const handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingCaption(event.target.value);
  };

  const handleCaptionSave = (index: number) => {
    if (editingIndex === null) return;
    const updatedImages = [...galleryImages];
    updatedImages[index].caption = editingCaption;
    setGalleryImages(updatedImages);
    setEditingIndex(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter') {
      handleCaptionSave(index);
    } else if (event.key === 'Escape') {
      setEditingIndex(null);
    }
  };

  const handleDeleteImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // prevent modal from opening
    setGalleryImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Card className="animate-in fade-in-0 duration-1000">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Camera className="text-primary" />
          Photo Gallery
        </CardTitle>
        <CardDescription>A glimpse into our world. Click an image to enlarge.</CardDescription>
      </CardHeader>
      <CardContent>
          <Carousel
            className="w-full"
            opts={{
              align: 'start',
              loop: false,
            }}
          >
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                      <button
                        className="w-full aspect-video relative overflow-hidden rounded-lg group block bg-muted/50"
                        onClick={() => handleImageClick(image)}
                      >
                        <Image
                          src={image.src}
                          alt={image.caption || `Gallery image ${index + 1}`}
                          fill
                          className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={image.hint}
                        />
                      </button>
                    <div className="text-xs text-muted-foreground mt-2 px-1 flex items-center gap-2">
                      {editingIndex === index ? (
                        <Input
                          ref={editInputRef}
                          type="text"
                          value={editingCaption}
                          onChange={handleCaptionChange}
                          onBlur={() => handleCaptionSave(index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className="h-6 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <p className="flex-1 py-1 truncate" title={image.caption}>{image.caption}</p>
                      )}
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={(e) => handleEditClick(e, index)}>
                        <Pencil className="h-3 w-3" />
                        <span className="sr-only">Edit caption</span>
                      </Button>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                              <span className="sr-only">Delete image</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                image from the gallery.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={(e) => handleDeleteImage(e, index)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12" />
            <CarouselNext className="mr-12" />
          </Carousel>
      </CardContent>
      <CardFooter className="justify-center border-t pt-4">
        <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            disabled={isUploading}
          />
        <Button onClick={handleUploadClick} disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
      </CardFooter>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedImage && (
            <DialogContent
              className="max-w-4xl p-0"
              onCloseAutoFocus={() => setSelectedImage(null)}
            >
              <DialogTitle className="sr-only">{selectedImage.caption || 'Enlarged gallery image'}</DialogTitle>
              <div className="aspect-video relative">
                <Image
                  src={selectedImage.largeSrc}
                  alt={selectedImage.caption || 'Enlarged gallery image'}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedImage.caption && (
                 <DialogDescription className="p-4 pt-0 text-center">
                    {selectedImage.caption}
                  </DialogDescription>
              )}
            </DialogContent>
          )}
      </Dialog>
    </Card>
  );
}
