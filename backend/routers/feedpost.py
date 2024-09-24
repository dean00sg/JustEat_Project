from typing import List
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from deps import get_session, get_current_user, get_current_user_role
from models.feedpost import FeedPost, FeedPostCreate, FeedPostUpdate, FeedPostResponse, LogFeedPost
from datetime import datetime

router = APIRouter(tags=["FeedPost"])

@router.post("/", response_model=FeedPostResponse)
def create_feed_post(
    feed_post: FeedPostCreate,
    session: Session = Depends(get_session),
    username: str = Depends(get_current_user),  # Fetch current user's username
    role: str = Depends(get_current_user_role)  # Ensure this checks for admin role
):
    # Create a new FeedPost instance
    db_feed_post = FeedPost(
        **feed_post.dict(),
        record_date=datetime.now().replace(microsecond=0)
    )
    session.add(db_feed_post)
    session.commit()
    session.refresh(db_feed_post)

    # Log the creation action
    log_entry = LogFeedPost(
        action_name="insert",
        action_byname=username,
        action_datetime=datetime.now().replace(microsecond=0),
        NT_id=db_feed_post.NT_id,
        header=db_feed_post.header,
        to_header=None,
        start_datetime=db_feed_post.start_datetime.replace(microsecond=0),
        to_start_datetime=None,
        end_datetime=db_feed_post.end_datetime.replace(microsecond=0),
        to_end_datetime=None,
        image_url=db_feed_post.image_url,
        to_image_url=None,
        description=db_feed_post.description,
        to_description=None,
        record_date=db_feed_post.record_date.replace(microsecond=0),
        to_record_date=None
    )
    session.add(log_entry)
    session.commit()

    # Prepare response
    response = FeedPostResponse(
        status="success",
        NT_id=db_feed_post.NT_id,
        header=db_feed_post.header,
        start_datetime=db_feed_post.start_datetime,
        end_datetime=db_feed_post.end_datetime,
        image_url=db_feed_post.image_url,
        description=db_feed_post.description,
        record_date=db_feed_post.record_date
    )
    return response

@router.get("/", response_model=List[FeedPostCreate])
def get_all_feed_posts(
    session: Session = Depends(get_session)
):
    # Fetch all FeedPost instances
    db_feed_posts = session.query(FeedPost).all()
    
    if not db_feed_posts:
        raise HTTPException(status_code=404, detail="No FeedPosts found")

    # Prepare response
    response = [
        FeedPostCreate(
            NT_id=feed_post.NT_id,
            header=feed_post.header,
            start_datetime=feed_post.start_datetime.replace(microsecond=0),
            end_datetime=feed_post.end_datetime.replace(microsecond=0),
            image_url=feed_post.image_url,
            description=feed_post.description,
            record_date=feed_post.record_date.replace(microsecond=0)
        )
        for feed_post in db_feed_posts
    ]
    return response

@router.put("/{feed_post_id}", response_model=FeedPostResponse)
def update_feed_post(
    feed_post_id: int,
    feed_post_update: FeedPostUpdate,
    session: Session = Depends(get_session),
    username: str = Depends(get_current_user),  # Fetch current user's username
    role: str = Depends(get_current_user_role)  # Ensure this checks for admin role
):
    # Fetch the existing FeedPost instance
    db_feed_post = session.query(FeedPost).filter(FeedPost.NT_id == feed_post_id).first()
    if db_feed_post is None:
        raise HTTPException(status_code=404, detail="FeedPost not found")

    # Save old values for logging
    old_feed_post = {
        "header": db_feed_post.header,
        "start_datetime": db_feed_post.start_datetime.replace(microsecond=0),
        "end_datetime": db_feed_post.end_datetime.replace(microsecond=0),
        "image_url": db_feed_post.image_url,
        "description": db_feed_post.description,
        "record_date": db_feed_post.record_date.replace(microsecond=0),
    }

    # Update the feed post with new values
    for key, value in feed_post_update.dict(exclude_unset=True).items():
        setattr(db_feed_post, key, value)

    session.commit()
    session.refresh(db_feed_post)

    # Log the update action
    log_entry = LogFeedPost(
        action_name="update",
        action_byname=username,
        action_datetime=datetime.now().replace(microsecond=0),
        NT_id=db_feed_post.NT_id,
        header=old_feed_post["header"],
        to_header=db_feed_post.header,
        start_datetime=old_feed_post["start_datetime"],
        to_start_datetime=db_feed_post.start_datetime.replace(microsecond=0),
        end_datetime=old_feed_post["end_datetime"],
        to_end_datetime=db_feed_post.end_datetime.replace(microsecond=0),
        image_url=old_feed_post["image_url"],
        to_image_url=db_feed_post.image_url,
        description=old_feed_post["description"],
        to_description=db_feed_post.description,
        record_date=old_feed_post["record_date"],
        to_record_date=db_feed_post.record_date.replace(microsecond=0)
    )
    session.add(log_entry)
    session.commit()

    # Prepare response
    response = FeedPostResponse(
        status="success",
        NT_id=db_feed_post.NT_id,
        header=db_feed_post.header,
        start_datetime=db_feed_post.start_datetime,
        end_datetime=db_feed_post.end_datetime,
        image_url=db_feed_post.image_url,
        description=db_feed_post.description,
        record_date=db_feed_post.record_date
    )
    return response


@router.delete("/{feed_post_id}", status_code=status.HTTP_200_OK)
def delete_feed_post(
    feed_post_id: int,
    session: Session = Depends(get_session),
    username: str = Depends(get_current_user),
    role: str = Depends(get_current_user_role)
):
    db_feed_post = session.query(FeedPost).filter(FeedPost.NT_id == feed_post_id).first()
    if db_feed_post is None:
        raise HTTPException(status_code=404, detail="FeedPost not found")

    log_entry = LogFeedPost(
        action_name="delete",
        action_byname=username,
        action_datetime=datetime.now().replace(microsecond=0),
        NT_id=db_feed_post.NT_id,
        header=db_feed_post.header,
        to_header=None,
        start_datetime=db_feed_post.start_datetime.replace(microsecond=0),
        to_start_datetime=None,
        end_datetime=db_feed_post.end_datetime.replace(microsecond=0),
        to_end_datetime=None,
        image_url=db_feed_post.image_url,
        to_image_url=None,
        description=db_feed_post.description,
        to_description=None,
        record_date=db_feed_post.record_date.replace(microsecond=0),
        to_record_date=None
    )
    session.add(log_entry)
    session.commit()

    session.delete(db_feed_post)
    session.commit()

    return {"status": "success", "detail": "FeedPost deleted successfully"}

